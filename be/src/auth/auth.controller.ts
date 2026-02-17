import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './auth.decorator';
import { LogUserDto } from 'src/dtos/users';
import { ApiBody } from '@nestjs/swagger';
import { userDefaultDataDTO } from 'src/constants/constants';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LogUserDto, examples: userDefaultDataDTO.login })
  async login(
    @Body() userInfo: LogUserDto,
  ): Promise<ReturnType<AuthService['login']>> {
    const { email, password } = userInfo;
    return this.authService.login(email, password);
  }
}
