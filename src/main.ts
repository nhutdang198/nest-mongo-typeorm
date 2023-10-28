import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './common/swagger';
import * as RequestIP from 'request-ip';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'fatal', 'log', 'verbose', 'warn'],
  });
  const configService = app.get(ConfigService);

  // swagger config
  setupSwagger(app);

  // get client IP middleware
  app.use(RequestIP.mw());

  const port = configService.get<number>('APP_OUTSIDE_PORT');
  await app.listen(port);
}

bootstrap();
