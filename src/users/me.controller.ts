import {Controller, Delete, Get, Patch, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt/jwt-auth.guard";
import {UserParamDecorator} from "../decorators/UserDecorator";
import {UserService} from "./users.service";
import { UserModel } from '../models/User';
import { UserSelfDTO } from '../models/User';
import { ApiCookieAuth, ApiResponse } from '@nestjs/swagger';

@Controller('me')
export class MeController {
    constructor(private readonly usersService: UserService){}

    @ApiCookieAuth('refresh_token')
    @ApiResponse({type: UserSelfDTO})
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@UserParamDecorator() user: UserModel) {
        const { hashedPassword, ...res } = (await this.usersService.findByUsername(user.username)).toObject()
        return res
    }

    @ApiCookieAuth('refresh_token')
    @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(@UserParamDecorator() user: UserModel){
        await user.deleteOne()
    }

    @ApiCookieAuth('refresh_token')
    @UseGuards(JwtAuthGuard)
    @Patch()
    async invalidateByTime(@UserParamDecorator() user: UserModel) {
        user.valid_since = new Date()
        await user.save()
    }
    

}
