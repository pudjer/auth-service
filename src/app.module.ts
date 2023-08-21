import {MiddlewareConsumer, Module, ValidationPipe} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import DockerConfLoad from "./config/DockerConfLoad";
import {AuthModule} from './auth/auth.module';
import {UsersModule} from "./users/users.module";
import {getMongoConfig} from "./config/mongo.config";
import * as cookieParser from "cookie-parser";
import {APP_PIPE} from "@nestjs/core";
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [DockerConfLoad],
      isGlobal: true,
      cache: true,
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [{
    provide: APP_PIPE,
    useClass: ValidationPipe
  }]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(cookieParser())
        .forRoutes('*')
  }
}
