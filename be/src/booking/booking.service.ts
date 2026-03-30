import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { RedisService } from 'src/redis/redis.service';
import { BookingSlot, CreateBookingRequest } from './booking.interface';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SpecialistScheduleInfo } from 'src/specialists/specialist.interfaces';
import { addMinutes, computeSlots } from 'src/utils/utils';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly redisService: RedisService,
  ) {}

  async getSlots(specialistId: string, date: string): Promise<BookingSlot[]> {
    const cached = await this.redisService.get(`schedule:${specialistId}`);
    if (!cached)
      throw new NotFoundException(
        'Schedule not found for specialist ' + specialistId,
      );
    const schedule: SpecialistScheduleInfo[] = JSON.parse(cached);

    const dayOfWeek = new Date(date).getDay();
    const daySchedule = schedule.find(s => s.day_of_week === dayOfWeek);
    if (!daySchedule) return [];

    const slots: BookingSlot[] = [
      ...computeSlots(
        daySchedule.opening_morning,
        daySchedule.closing_morning,
        daySchedule.slot_size_minutes,
      ).map(slot => ({ ...slot, available: true })),
      ...computeSlots(
        daySchedule.opening_afternoon,
        daySchedule.closing_afternoon,
        daySchedule.slot_size_minutes,
      ).map(slot => ({ ...slot, available: true })),
    ];

    const existing = (await this.knex('appointment')
      .select('time_start')
      .where({
        id_specialist: specialistId,
        date,
        deleted: false,
      })) as Array<{ time_start: string }>;
    const bookedSlots = new Set(existing.map(e => e.time_start.slice(0, 5)));

    return Promise.all(
      slots.map(async (slot): Promise<BookingSlot> => {
        const lockKey = `booking:lock:${specialistId}:${date}:${slot.time_start}`;
        const isLocked = await this.redisService.get(lockKey);
        return {
          ...slot,
          available: !bookedSlots.has(slot.time_start) && !isLocked,
        };
      }),
    );
  }

  async createBooking(req: CreateBookingRequest): Promise<void> {
    const { specialistId, date, timeStart, patientId } = req;
    const lockKey = `booking:lock:${specialistId}:${date}:${timeStart}`;

    const acquiredLock = await this.redisService.acquireLock(
      lockKey,
      'locked',
      30,
    );
    if (!acquiredLock)
      throw new ConflictException(
        'Time slot is currently being booked by another user. Please try again.',
      );

    const cached = await this.redisService.get(`schedule:${specialistId}`);
    const schedule: SpecialistScheduleInfo[] = cached ? JSON.parse(cached) : [];
    const dayOfWeek = new Date(date).getDay();
    const daySchedule = schedule.find(s => s.day_of_week === dayOfWeek);
    const timeEnd = addMinutes(timeStart, daySchedule?.slot_size_minutes || 0);

    try {
      await this.knex('appointment').insert({
        id_patient: patientId,
        id_specialist: specialistId,
        id_status: 1,
        time_start: timeStart,
        time_end: timeEnd,
      });
      await this.redisService.del(lockKey);
    } catch (error) {
      if (error instanceof ConflictException) {
        await this.redisService.del(lockKey);
        throw error;
      }
      throw new InternalServerErrorException('Failed to create booking', error);
    }
  }
}
