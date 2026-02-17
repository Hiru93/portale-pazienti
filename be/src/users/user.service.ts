import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { UserInfo, RegisterInfoSuccess } from './users.interfaces';
import {
  saltGen,
  sanitizeDate,
  sanitizeEmail,
  sanitizeNumber,
  validateEmail,
} from 'src/utils/utils';

@Injectable()
export class UserService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async register(
    userInfo: UserInfo,
  ): Promise<
    RegisterInfoSuccess | BadRequestException | InternalServerErrorException
  > {
    const { email, password, id_role } = userInfo;
    if (!email || !password) {
      throw new BadRequestException('Missing params');
    }

    if (!validateEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }

    const trx = await this.knex.transaction();

    try {
      const user = await this.knex(
        id_role === 2
          ? 'bo_operator'
          : id_role === 3
            ? 'patient'
            : 'specialist',
      )
        .where({ email: sanitizeEmail(email) })
        .first();
      if (user) {
        throw new BadRequestException('User already exists');
      }

      const saltedPass = await saltGen(password);
      const sanitizedEmail = sanitizeEmail(email);

      /**
       * In order to create the correct object on the fly and filtering out all the null values
       * we need to manipulate the object converting it to an array of couples, filtering it out
       * deleting each null value and finally we can convert it back to an object.
       * In order to do so, we need to use "Object.entries" to convert the object in an array of couples "key - value"
       * After that, we need to filter it
       * And finally, we can use Objec.fromEntries to convert it back to an object
       * -------------------------------
       * On top of what has just been said, we need to remove some fields which are not contained inside the tables
       * for each user role
       */
      const standardizedUserInfo = Object.fromEntries(
        Object.entries({
          ...userInfo,
          deleted: false,
          email: sanitizedEmail,
          phone:
            userInfo.phone && userInfo.id_role !== 2
              ? sanitizeNumber(userInfo.phone, true)
              : null,
          birth_date:
            userInfo.birth_date && userInfo.id_role !== 2
              ? sanitizeDate(userInfo.birth_date)
              : null,
          clinic_phone:
            userInfo.clinic_phone && userInfo.id_role === 4
              ? sanitizeNumber(userInfo.clinic_phone, true)
              : null,
          password: null,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }).filter(([_, value]) => value !== null),
      );

      let insertedUser: Array<{ id: string }> = [];

      switch (id_role) {
        // 2 - Operator role
        case 2: {
          // Removing useless fileds from the operator object
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { phone, birth_date, clinic_phone, password, ...newUserObj } =
            standardizedUserInfo;
          insertedUser = await trx('bo_operator').insert(newUserObj, ['id']);
          break;
        }
        // 3 - Patient role
        case 3:
          insertedUser = await trx('patient').insert(standardizedUserInfo, [
            'id',
          ]);
          break;
        // 4 - Specialist role
        case 4:
          insertedUser = await trx('specialist').insert(standardizedUserInfo, [
            'id',
          ]);
          break;
        default:
          throw new InternalServerErrorException('Invalid role');
      }

      const userCredentials: Array<{ id: string }> = await trx(
        'user_credential',
      ).insert(
        {
          id_patient: id_role === 3 ? insertedUser[0].id : null,
          id_operator: id_role === 2 ? insertedUser[0].id : null,
          id_specialist: id_role === 4 ? insertedUser[0].id : null,
          active: false,
          deleted: false,
          email: sanitizedEmail,
          password: saltedPass,
        },
        ['id'],
      );

      await trx.commit();

      return {
        opInfo:
          id_role === 2
            ? {
                userId: insertedUser[0].id,
                credId: userCredentials[0].id,
              }
            : null,
        patInfo:
          id_role === 3
            ? {
                userId: insertedUser[0].id,
                credId: userCredentials[0].id,
              }
            : null,
        specInfo:
          id_role === 4
            ? {
                userId: insertedUser[0].id,
                credId: userCredentials[0].id,
              }
            : null,
      };
    } catch (error) {
      await trx.rollback();
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error registering user: ', error);
    }
  }
}
