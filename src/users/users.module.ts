import { Module } from '@nestjs/common';
import { LocalStrategy } from './local/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./jwt/jwt.strategy";
import { UserController } from './users.controller';
import { EmailCheckHandler } from './users.emailchecker';
import { EmailModule } from '../email/email.module';
import { messagePattern } from '../config/variables';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema } from './models/Location';
import { User, UserScheme } from './models/User';
import { UserService } from './users.service';
import { UserLocation } from './models/Location';
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService)=>({
        secret: await configService.get('SECRET_KEY'),
        global: true,
      }),
      inject: [ConfigService],
    }),
    EmailModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        port: configService.get('SMTP_PORT'),
        user: configService.get('SMTP_USER'),
        password: configService.get('SMTP_PASSWORD'),
        host: configService.get('SMTP_HOST'),
        from: 'tirettur@mail.ru'
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserScheme },
      { name: UserLocation.name, schema: LocationSchema }
    ])
  ],
  providers: [LocalStrategy, JwtStrategy, EmailCheckHandler, UserService,
  {
    useValue: (token: string)=>{
      return messagePattern + ' '+ token
    },
    provide: 'EMAIL_FUNC'
  }
  ],
  controllers: [UserController],
})
export class UserModule {}