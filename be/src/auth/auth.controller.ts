import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './auth.decorator';
import { LogOutUserDto, LogUserDto } from 'src/dtos/users';
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

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiBody({ type: LogOutUserDto, examples: userDefaultDataDTO.logout })
  async logout(
    @Body() params: LogOutUserDto,
  ): Promise<ReturnType<AuthService['logout']>> {
    const { token } = params;
    return this.authService.logout(token);
  }
}
