import {MiddlewareConsumer, Module, ValidationPipe} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthModule} from '../auth/auth.module';
import {UsersModule} from "../users/users.module";
import {getMongoConfig} from "../config/mongo.config";
import * as cookieParser from "cookie-parser";
import {APP_INTERCEPTOR, APP_PIPE} from "@nestjs/core";
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MongooseModule } from '@nestjs/mongoose';
import { stripInterceptor } from './stripInterceptor';
import { privateAttributes, validationSchema } from '../config/variables';
import { EmailModule } from '../email/email.module';
import { CqrsModule } from '@nestjs/cqrs';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: validationSchema
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
    AuthModule,
    CqrsModule,
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
