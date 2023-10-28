import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import {
  SWAGGER_API_ENDPOINT,
  SWAGGER_API_NAME,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_DEFAULT_VERSION,
} from './swagger.constant';
import { swaggerOptions } from './swagger.options';

export const setupSwagger = (app: INestApplication) => {
  const swaggerConfigs = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(process.env.APP_VERSION || SWAGGER_API_DEFAULT_VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfigs,
    swaggerOptions,
  );
  SwaggerModule.setup(SWAGGER_API_ENDPOINT, app, document);
};
