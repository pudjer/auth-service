import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import {ValidationPipe} from "@nestjs/common";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT')) || 3000
  await app.listen(port);
}
bootstrap();
