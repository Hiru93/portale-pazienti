import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<boolean> {
    const result = await this.redis.del(key);

    return result === 1;
  }

  // Race condition guard with NX & PX options:
  // - NX: Only set the key if it does not already exist.
  // - PX: Set the expiration time in milliseconds.
  async acquireLock(
    key: string,
    value: string,
    ttlSeconds: number,
  ): Promise<boolean> {
    const result = await this.redis.set(
      key,
      value,
      'PX',
      ttlSeconds * 1000,
      'NX',
    );
    return result === 'OK';
  }
}
