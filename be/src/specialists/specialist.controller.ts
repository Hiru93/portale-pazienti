import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SpecialistService } from './specialist.service';
import { SpecialistListRequestDto } from 'src/dtos/specialists';

@ApiTags('Specialist')
@ApiBearerAuth('Bearer')
@Controller('/api/specialist')
export class SpecialistController {
  constructor(private specialistService: SpecialistService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getSpecialistList(
    @Query() queryParams: SpecialistListRequestDto,
  ): Promise<ReturnType<SpecialistService['getSpecialists']>> {
    const { lat, lng, radius } = queryParams;
    return await this.specialistService.getSpecialists({ lat, lng, radius });
  }
}
