import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { roleDefaultDataDTO } from 'src/constants/constants';

/**
 * @description
 * [COMMON - ROLES] Common characteristics of a role
 */
export class RoleDto {
  @ApiProperty({
    description: '[COMMON - ROLES] Role ID (e.g., 1 for Ghost, 2 for Operator)',
    example: roleDefaultDataDTO.list[0].id,
  })
  @IsString()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description:
      '[COMMON - ROLES] Role description (e.g., "Ghost", "Operator")',
    example: roleDefaultDataDTO.list[0].description,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description:
      '[COMMON - ROLES] Role auth level list (e.g., "ghost", "operator")',
    example: roleDefaultDataDTO.list[0].auth_list.auth[0],
  })
  @IsString()
  @IsNotEmpty()
  auth_list: string;
}
