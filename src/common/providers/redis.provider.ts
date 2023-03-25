import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

const getRedisConfig = (configService: ConfigService): RedisOptions => ({
  host: configService.get<string>('REDIS_HOST'),
  port: configService.get<number>('REDIS_PORT'),
});

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: async (configService: ConfigService) => {
    const config = getRedisConfig(configService);
    return new Redis(config);
  },
  inject: [ConfigService],
};
