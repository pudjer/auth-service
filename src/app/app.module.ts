import {MiddlewareConsumer, Module, ValidationPipe} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthModule} from '../auth/auth.module';
import {UsersModule} from "../users/users.module";
import {getMongoConfig} from "../config/mongo.config";
import * as cookieParser from "cookie-parser";
import {APP_INTERCEPTOR, APP_PIPE} from "@nestjs/core";
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { stripInterceptor } from './stripInterceptor';
import { privateAttributes } from '../config/variables';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
    AuthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new stripInterceptor(privateAttributes)
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(cookieParser())
        .forRoutes('*')
  }
}