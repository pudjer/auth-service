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

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService)=>({
        secret: await configService.get('SECRET_KEY'),
        signOptions: { expiresIn: '60s' },
        global: true,
      }),
      inject: [ConfigService],
    }),
    CqrsModule,
  ],
  providers: [EmailService, AuthService, LocalStrategy, JwtStrategy, EmailCheckHandler],
  controllers: [AuthController],
})
export class AuthModule {}