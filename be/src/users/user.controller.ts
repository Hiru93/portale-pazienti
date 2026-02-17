import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SkipAuth } from 'src/auth/auth.decorator';
import { CreateUserDto } from 'src/dtos/users';
import { UserService } from './user.service';
import { UserInfo } from './users.interfaces';
import { ApiBody } from '@nestjs/swagger';
import { userDefaultDataDTO } from 'src/constants/constants';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiBody({ type: CreateUserDto, examples: userDefaultDataDTO.register })
  async register(
    @Body() userInfo: CreateUserDto,
  ): Promise<ReturnType<UserService['register']>> {
    const { opInfo, patInfo, specInfo } = userInfo;
    const userToCreate = (opInfo || patInfo || specInfo) as unknown as UserInfo;
    return await this.userService.register({
      ...userToCreate,
      id_role: opInfo ? 2 : patInfo ? 3 : 4,
    });
  }
}
