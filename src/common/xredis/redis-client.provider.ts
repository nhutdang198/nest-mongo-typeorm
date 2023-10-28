import { Logger } from '@nestjs/common';
import { createClient } from 'redis';

const env = process.env;

export const XRedisClientProviders = [
  {
    provide: 'X_REDIS_CLIENT',
    useFactory: async () => {
      const logger = new Logger('Redis Client');
      const client = await createClient({
        url: `redis://localhost:${env.REDIS_OUTSIDE_PORT}`,
      })
        .on('error', (err) => console.log('Redis Client Error', err))
        .connect()
        .finally(() => logger.log('redis connected'));
      return client;
    },
  },
];
