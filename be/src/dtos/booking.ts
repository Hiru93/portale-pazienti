import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class GetSlotsDto {
  @IsNumber() @Type(() => Number) specialistId: number;
  @IsDateString() date: string;
}

export class CreateBookingDto {
  @IsString() specialistId: string;
  @IsDateString() date: string;
  @IsString() timeStart: string; // "09:00"
}
