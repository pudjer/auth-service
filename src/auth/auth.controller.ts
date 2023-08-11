import {Body, Controller, Post,  Response, UseGuards} from '@nestjs/common';
import {LocalAuthGuard} from './local/local-auth.guard';
import {AuthService, UserRegistrationDTO} from './auth.service';
import {Response as ExpressResponse} from 'express'
import {User} from "../utils/UserDecorator";
import {UserPublicDTO} from "../types/UserPublicDTO";

///TODO add validations
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@User() user: UserPublicDTO, @Response() res: ExpressResponse) {
        const modifiedRes: ExpressResponse = await this.authService.addCredentials(res, user)
        modifiedRes.status(200)
        modifiedRes.send()
    }

    @Post('register')
    async register(@Body() user: UserRegistrationDTO){
        return await this.authService.register(user)
    }

}
