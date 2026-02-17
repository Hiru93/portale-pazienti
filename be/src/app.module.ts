import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './users/user.module';
import { CommonModule } from './commons/common.module';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'pg',
        useNullAsDefault: true,
        connection: {
          host: process.env.PP_PG_HOST,
          user: process.env.PP_PG_USER,
          password: process.env.PP_PG_PASS,
          database: process.env.PP_PG_DB,
          port: parseInt(process.env.PP_PG_PORT || ''),
        },
      },
    }),
    CommonModule,
    AuthModule,
    UserModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
