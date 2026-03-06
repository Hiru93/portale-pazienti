import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { compareHash } from 'src/utils/utils';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel() private readonly knex: Knex,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{
    access_token: string;
  }> {
    if (!email || !password) {
      throw new UnauthorizedException('Missing params');
    }

    try {
      const userInfo = await this.knex('user_credential')
        .select('id_patient', 'id_operator', 'id_specialist', 'password')
        .where({
          email,
          deleted: false,
        })
        .first();
      if (!userInfo || !(await compareHash(password, userInfo.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const fullUserInfo = await this.knex(
        userInfo.id_patient
          ? 'patient'
          : userInfo.id_operator
            ? 'bo_operator'
            : 'specialist',
      )
        .select('id', 'first_name', 'last_name', 'email', 'id_role')
        .where({
          id:
            userInfo.id_patient ||
            userInfo.id_operator ||
            userInfo.id_specialist,
        })
        .first();

      const role_auth = await this.knex('role')
        .select('auth_list')
        .where({ id: fullUserInfo.id_role })
        .first();

      if (!role_auth) {
        throw new UnauthorizedException('Invalid role');
      }

      const availableComponents = await this.knex('component')
        .select('id', 'name', 'label', 'icon', 'path', 'order')
        .whereRaw(
          'EXISTS (SELECT 1 FROM jsonb_array_elements_text(roles) r WHERE r.value::int = ANY(?))',
          [[fullUserInfo.id_role]], // double-wrap: outer array = bindings list, inner = the pg array value
        );

      const signedJwt = this.jwtService.sign(
        {
          user_email: fullUserInfo.email,
          user_id: fullUserInfo.id,
          user_auth: role_auth.auth_list.auth,
          user_data: {
            first_name: fullUserInfo['first_name'],
            last_name: fullUserInfo['last_name'],
          },
          available_components: availableComponents,
        },
        {
          expiresIn: '7d',
        },
      );

      await this.knex('user_credential')
        .where({ email: fullUserInfo.email })
        .update({
          last_login_at: new Date(),
        });

      return {
        access_token: signedJwt,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  async logout(token: string): Promise<{
    message: string;
  }> {
    if (!token) throw new UnauthorizedException('Missing params');
    try {
      const decodedToken = this.jwtService.decode(token);
      if (
        !decodedToken ||
        decodedToken.exp < Date.now() / 1000 ||
        !decodedToken.user_email
      )
        throw new UnauthorizedException('Invalid token');
      const user = await this.knex('user_credential')
        .select({ email: 'email', deleted: 'deleted' })
        .where({ email: decodedToken.user_email })
        .first();
      if (!user || user.deleted)
        throw new UnauthorizedException('Forged token');

      return {
        message: 'Logout successful',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Logout failed');
    }
  }
}
