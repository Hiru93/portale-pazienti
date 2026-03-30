import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto, GetSlotsDto } from 'src/dtos/booking';

@ApiTags('Booking')
@ApiBearerAuth('Bearer')
@Controller('/api/booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get('/slots')
  async getSlots(@Query() query: GetSlotsDto) {
    return this.bookingService.getSlots(
      query.specialistId.toString(),
      query.date,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createBooking(@Body() body: CreateBookingDto, @Request() req: any) {
    const patientId = req.users.sub; // extracted from JWT payload by AuthGuard
    return this.bookingService.createBooking({ ...body, patientId });
  }
}
