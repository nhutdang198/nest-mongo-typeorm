import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { envValidator } from './common/validations';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
  LoggingInterceptor,
  TimeoutInterceptor,
  TransformInterceptor,
} from './common/interceptors';
import {
  HttpExceptionFilter,
  KeyDuplicatedExceptionFilter,
} from './common/filters';
import { ProductModule } from './modules/product/module';

@Module({
  imports: [
    ProductModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envValidator,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: false,
        skipMissingProperties: false,
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: KeyDuplicatedExceptionFilter,
    },
  ],
})
export class AppModule {}
