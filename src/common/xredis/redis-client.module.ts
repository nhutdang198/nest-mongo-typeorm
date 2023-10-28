import { Module } from '@nestjs/common';
import { XRedisClientProviders } from './redis-client.provider';

@Module({
  providers: [...XRedisClientProviders],
  exports: [...XRedisClientProviders],
})
export class XRedisClientModule {}
