import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local/local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./jwt/jwt.strategy";
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailCheckHandler } from './auth.emailchecker';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';
import { messagePattern } from '../config/variables';

@Module({
  imports: [
    UsersModule,
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
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, EmailCheckHandler,
  {
    useValue: (token: string)=>{
      return messagePattern + ' '+ token
    },
    provide: 'EMAIL_FUNC'
  }
  ],
  controllers: [AuthController],
})
export class AuthModule {}