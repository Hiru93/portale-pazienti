import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { Role } from './common.interfaces';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CommonService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly redisService: RedisService,
  ) {}

  async getRoles(): Promise<Role[] | InternalServerErrorException> {
    try {
      const roles: Role[] = await this.knex('role').select('id', 'description');
      return roles;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch roles ', error);
    }
  }

  async getDays(): Promise<
    { id: string; name: string }[] | InternalServerErrorException
  > {
    try {
      const days = await this.redisService.get('days');
      if (days) {
        return JSON.parse(days) as { id: string; name: string }[];
      }

      const daysFromDb = await this.knex('day').select(
        'id',
        'description as name',
      );
      await this.redisService.set('days', JSON.stringify(daysFromDb));
      return daysFromDb as { id: string; name: string }[];
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch days ', error);
    }
  }
}
