import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './users/user.module';
import { CommonModule } from './commons/common.module';
import { RedisModule } from './redis/redis.module';
import { SpecialistModule } from './specialists/specialist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KnexModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          client: 'pg',
          useNullAsDefault: true,
          connection: {
            host: config.get<string>('PP_PG_HOST'),
            user: config.get<string>('PP_PG_USER'),
            password: config.get<string>('PP_PG_PASS'),
            database: config.get<string>('PP_PG_DB'),
            port: parseInt(config.get<string>('PP_PG_PORT') || ''),
          },
        },
      }),
    }),
    RedisModule,
    CommonModule,
    AuthModule,
    UserModule,
    SpecialistModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
