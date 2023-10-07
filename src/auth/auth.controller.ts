import { Body, Controller, Get, Post, Response, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local/local-auth.guard';
import { AuthService } from './auth.service';
import { Response as ExpressResponse } from 'express';
import { UserParamDecorator } from '../decorators/UserDecorator';
import { UserCreateDTO, UserLoginDTO, UserModel, UserSelfDTO } from '../models/User';
import { AccessToken, Tokens } from '../models/Tokens';
import { TOKEN_NAME } from './jwt/jwt.strategy';
import { User } from '../models/User';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { ApiBody, ApiCookieAuth, ApiResponse } from '@nestjs/swagger';
import { EmailService } from '../email/email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService
    ) {}

  @UseGuards(LocalAuthGuard)
  @ApiResponse({type: AccessToken})
  @Post('login')
  @ApiBody({ type: UserLoginDTO })
  async login(
    @UserParamDecorator() user: UserModel,
    @Response({passthrough: true}) res: ExpressResponse
    ){
    const { refresh_token, access_token } = await this.authService.getTokens(user);
    res.cookie(TOKEN_NAME, refresh_token, {httpOnly: true})
    return {access_token: access_token}
  }

  @ApiCookieAuth('refresh_token')
  @ApiResponse({ type: AccessToken })
  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  async refresh(
    @UserParamDecorator() user: UserModel,
    @Response({ passthrough: true }) res: ExpressResponse
    ){
    return this.login(user, res)
  }

  @ApiResponse({type: UserSelfDTO})
  @Post('register')
  async register(@Body() user: UserCreateDTO): Promise<UserSelfDTO> {
    
    return await this.authService.register(user);
  }


  @Post('email')
  async email(){
    return this.emailService.send({
      from: 'tirettur@mail.ru',
      to: 'degil59750@finghy.com',
      subject: 'Hello from AWS SES',
      text: 'This is a test email sent from AWS SES SMTP in Node.js.',
    })
  }
}

