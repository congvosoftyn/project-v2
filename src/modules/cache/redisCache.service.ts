import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cache: Cache
    ) { }

    async get(key): Promise<string> {
        return await this.cache.get(key);
    }

    async set(key, value) {
        return await this.cache.set(key, value);
    }

    async delete(key: string) {
        return await this.cache.del(key);
    }
}
