import { CacheModule, Module } from '@nestjs/common';
import { RedisCacheService } from './redisCache.service';
import type { RedisClientOptions } from "redis";
import * as redisStore from 'cache-manager-redis-store';
import { REDIS_HOST, REDIS_PORT, REDIS_TTL } from 'src/config';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: REDIS_HOST,
      port: REDIS_PORT,
      // socket: {
      //   host: REDIS_HOST,
      //   port: REDIS_PORT
      // },
      ttl: REDIS_TTL
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService]
})
export class RedisCacheModule { }
