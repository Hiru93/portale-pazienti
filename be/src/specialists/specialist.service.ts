import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import {
  ListSpecialistSuccess,
  SpecialistInfo,
  SpecialistListRequest,
} from './specialist.interfaces';
import { dbBoundingBox, haversineDistance } from 'src/utils/utils';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SpecialistService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly redisService: RedisService,
  ) {}

  async getSpecialists(
    coords: SpecialistListRequest,
  ): Promise<
    ListSpecialistSuccess | BadRequestException | InternalServerErrorException
  > {
    const { lat, lng, radius } = coords;
    if (!lat || !lng) {
      throw new BadRequestException('Missing params');
    }

    try {
      const boundingBox = dbBoundingBox({ lat, lng, radius });

      const specialistsWithinBox = await this.knex('specialist')
        .select(
          'id',
          'first_name',
          'last_name',
          'clinic_city',
          'clinic_address',
          'clinic_phone',
          'clinic_name',
          'clinic_coords',
        )
        .whereRaw(
          `((clinic_coords)[0] BETWEEN ? AND ? AND (clinic_coords)[1] BETWEEN ? AND ?) AND deleted = false`,
          [
            boundingBox.minLng,
            boundingBox.maxLng,
            boundingBox.minLat,
            boundingBox.maxLat,
          ],
        );

      const specialistsWithinRadius = specialistsWithinBox.filter(s => {
        // pg driver parses PostgreSQL point(lng, lat) into {x: lng, y: lat}
        const coords = s.clinic_coords as unknown as { x: number; y: number };
        const distance = haversineDistance({
          lat1: lat,
          lng1: lng,
          lat2: coords.y,
          lng2: coords.x,
        });
        return distance <= radius;
      });

      const specialistsWithSchedule = specialistsWithinRadius.map(
        async (specialist: SpecialistInfo) => {
          let scheduleFromCache = await this.redisService.get(
            `schedule:${specialist.id}`,
          );
          if (!scheduleFromCache) {
            const schedule = await this.knex('opening_schedule')
              .select('*')
              .where({ id_specialist: specialist.id });
            await this.redisService.set(
              `schedule:${specialist.id}`,
              JSON.stringify(schedule),
            );
            scheduleFromCache = JSON.stringify(schedule);
          }
          return {
            ...specialist,
            clinic_schedule: JSON.parse(
              scheduleFromCache,
            ) as SpecialistInfo['clinic_schedule'],
          };
        },
      );

      return {
        specialists: await Promise.all(specialistsWithSchedule),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Database error');
    }
  }
}
