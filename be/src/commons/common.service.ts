import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { Role } from './common.interfaces';

@Injectable()
export class CommonService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async getRoles(): Promise<Role[] | InternalServerErrorException> {
    try {
      const roles: Role[] = await this.knex('role').select('id', 'description');
      return roles;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch roles ', error);
    }
  }
}
