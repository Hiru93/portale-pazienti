import {
  IsString,
  IsOptional,
  IsEmail,
  IsUUID,
  IsBoolean,
  IsArray,
  IsEnum,
  IsNumber,
  IsDateString,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum SpecialistStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

// ---- Create Specialist DTO ----
export class CreateSpecialistDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsString()
  fiscalCode: string;

  @IsString()
  specialization: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalSpecializations?: string[];

  @IsString()
  licenseNumber: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsEnum(SpecialistStatus)
  status?: SpecialistStatus;
}

// ---- Update Specialist DTO ----
export class UpdateSpecialistDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalSpecializations?: string[];

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsEnum(SpecialistStatus)
  status?: SpecialistStatus;
}

// ---- Specialist Availability DTO ----
export class SpecialistAvailabilitySlotDto {
  @IsString()
  dayOfWeek: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

export class SetSpecialistAvailabilityDto {
  @IsUUID()
  specialistId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecialistAvailabilitySlotDto)
  slots: SpecialistAvailabilitySlotDto[];
}

// ---- Search / Filter Specialists DTO ----
export class SearchSpecialistsDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsEnum(SpecialistStatus)
  status?: SpecialistStatus;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}

// ---- Specialist Response DTO ----
export class SpecialistResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: Gender;
  fiscalCode: string;
  specialization: string;
  additionalSpecializations?: string[];
  licenseNumber: string;
  bio?: string;
  profilePictureUrl?: string;
  address?: string;
  city?: string;
  province?: string;
  zipCode?: string;
  languages?: string[];
  status: SpecialistStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ---- Paginated Specialists Response DTO ----
export class PaginatedSpecialistsResponseDto {
  data: SpecialistResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---- Specialist Review DTO ----
export class CreateSpecialistReviewDto {
  @IsUUID()
  specialistId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

// ---- Specialist Appointment Request DTO ----
export class CreateSpecialistAppointmentDto {
  @IsUUID()
  specialistId: string;

  @IsUUID()
  patientId: string;

  @IsDateString()
  appointmentDate: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isTelemedicine?: boolean;
}

export class UpdateSpecialistAppointmentDto {
  @IsOptional()
  @IsDateString()
  appointmentDate?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  isTelemedicine?: boolean;
}

export class SpecialistListRequestDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: 'Latitude of the search center (Padova)',
    example: 45.40788691431949,
  })
  lat: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: 'Longitude of the search center (Padova)',
    example: 11.873302081642683,
  })
  lng: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: 'Search radius in kilometers',
    example: 100,
  })
  radius: number;
}

export class SpecialistListResponseDto {
  specialists: SpecialistResponseDto[];
}
