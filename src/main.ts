import { NestFactory, Reflector } from '@nestjs/core';
import { moduleFactory } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const defaultConfigService = configuration();
  const {
    database: {
      typeorm: { host, port, username, password },
    },
  } = defaultConfigService;
  const app = await NestFactory.create(moduleFactory({
    host, password, username, port
  }));
  const configService = app.get(ConfigService)
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false, transform: true
    }),
  )
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  await app.listen(configService.get('APP_PORT'))

  console.info(
    `Server started at http://localhost:${configService.get('APP_PORT')}`,
  );

}
bootstrap();
