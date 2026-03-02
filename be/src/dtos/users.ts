import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { userDefaultDataDTO } from 'src/constants/constants';

/**
 * @description
 * [USERS - ALL] Common characteristics of a user
 */
export class UserCommonPropsDto {
  @ApiProperty({
    description:
      '[USERS - ALL] User role ID, as in specialist, patient or operator',
  })
  @IsInt()
  id_role: number;

  @ApiProperty({ description: '[USERS - ALL] Email address, required' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '[USERS - ALL] First time used password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: '[USERS - ALL] Checks if user is active, default is true',
  })
  @IsBoolean()
  deleted: false;

  @ApiProperty({
    description: '[USERS - ALL] User name',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: '[USERS - ALL] User last name' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ description: "[USERS - ALL] User's address CAP" })
  @IsNotEmpty()
  @IsInt()
  @MaxLength(5)
  cap: number;

  @ApiProperty({ description: "[USERS - ALL] User's address city" })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: "[USERS - ALL] User's address state" })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ description: "[USERS - ALL] User's address" })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: "[USERS - ALL] User's fiscal code" })
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  cod_fisc: string;

  @ApiProperty({ description: "[USERS - ALL] User's birth date" })
  @IsNotEmpty()
  @IsDate()
  birth_date: string;

  @ApiProperty({ description: "[USERS - ALL] User's gender" })
  @IsNotEmpty()
  @IsString()
  sex: string;

  @ApiProperty({ description: "[USERS - ALL] User's phone number" })
  @IsNotEmpty()
  @IsString()
  phone: string;
}

/**
 * @description
 * [USERS - ALL] User creation DTO
 */
export class CreateUserDto {
  @ApiProperty({
    description: '[USERS - ALL] Operator user-info',
    example: userDefaultDataDTO.register.operator,
  })
  opInfo: CreateOperatorDto | null;

  @ApiProperty({
    description: '[USERS - ALL] Patient user-info',
    example: userDefaultDataDTO.register.patient,
  })
  patInfo: CreatePatientDto | null;

  @ApiProperty({
    description: '[USERS - ALL] Specialist user-info',
    example: userDefaultDataDTO.register.specialist,
  })
  specInfo: CreateSpecialistDto | null;
}

/**
 * @description
 * [USERS - OPERATORS] Operator specific characteristics
 */
export class CreateOperatorDto extends PickType(UserCommonPropsDto, [
  'email',
  'password',
  'first_name',
  'last_name',
  'deleted',
]) {
  @ApiProperty({
    description:
      '[USERS - OPERATORS] Operator field of action, like billing, support, etc...',
  })
  @IsInt()
  id_field: number;
}

/**
 * @description
 * [USERS - PATIENTS] Patient specific characteristics
 */
export class CreatePatientDto extends UserCommonPropsDto {
  @ApiProperty({ description: '[USERS - PATIENTS] Patient birthplace' })
  @IsString()
  @IsNotEmpty()
  birth_place: string;
}

/**
 * @description
 * [USERS - SPECIALISTS] Specialist specific characteristics
 */
export class CreateSpecialistDto extends UserCommonPropsDto {
  @ApiProperty({ description: "[USERS - SPECIALISTS] Specialist's p.iva" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  p_iva: string;

  @ApiProperty({ description: "[USERS - SPECIALISTS] Specialist's title" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "[USERS - SPECIALISTS] Specialist's specialization",
  })
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @ApiProperty({ description: '[USERS - SPECIALISTS] Clinic name' })
  @IsString()
  @IsNotEmpty()
  clinic_name: string;

  @ApiProperty({ description: '[USERS - SPECIALISTS] Clinic cap' })
  @IsInt()
  @IsNotEmpty()
  @MaxLength(5)
  clinic_cap: number;

  @ApiProperty({ description: '[USERS - SPECIALISTS] Clinic city' })
  @IsString()
  @IsNotEmpty()
  clinic_city: string;

  @ApiProperty({ description: '[USERS - SPECIALISTS] Clinic address' })
  @IsString()
  @IsNotEmpty()
  clinic_address: string;

  @ApiProperty({ description: '[USERS - SPECIALISTS] Clinic phone' })
  @IsString()
  @IsNotEmpty()
  clinic_phone: string;
}

export class LogUserDto extends PickType(UserCommonPropsDto, [
  'email',
  'password',
]) {
  @ApiProperty({
    description: '[USERS - ALL] User email address',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: '[USERS - ALL] User password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LogOutUserDto {
  @ApiProperty({
    description: '[USERS - ALL] User token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
