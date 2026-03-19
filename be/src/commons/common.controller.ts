import { Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { SkipAuth } from 'src/auth/auth.decorator';
import { CommonService } from './common.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Common')
@Controller('/api/common')
export class CommonController {
  constructor(private commonService: CommonService) {}

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Get('roles')
  async getRoles(): Promise<ReturnType<CommonService['getRoles']>> {
    return await this.commonService.getRoles();
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Get('days')
  async getDays(): Promise<ReturnType<CommonService['getDays']>> {
    return await this.commonService.getDays();
  }
}
