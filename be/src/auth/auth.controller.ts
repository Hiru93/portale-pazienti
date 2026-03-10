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
<<<<<<< Updated upstream
    return this.authService.login(email, password);
=======
    const { access_token, refresh_token } = await this.authService.login(
      email,
      password,
    );
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return { access_token };
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiBody({ type: LogOutUserDto, examples: userDefaultDataDTO.logout })
  async logout(
    @Body() params: LogOutUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refresh_token');
    return this.authService.logout(params.token);
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiBody({ type: RefreshUserDto, examples: userDefaultDataDTO.refresh })
  async refresh(
    @Body() params: RefreshUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    const { access_token, refresh_token } = await this.authService.refresh(
      params.userId,
      refreshToken,
    );
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { access_token };
>>>>>>> Stashed changes
  }
}
