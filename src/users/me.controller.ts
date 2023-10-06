import {Controller, Delete, Get, Patch, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt/jwt-auth.guard";
import {UserParamDecorator} from "../decorators/UserDecorator";
import {UserService} from "./users.service";
import { UserModel } from '../models/User';
import { UserSelfDTO } from '../models/User';
import { ApiCookieAuth, ApiNoContentResponse, ApiResponse } from '@nestjs/swagger';

@Controller('me')
export class MeController {
    constructor(private readonly usersService: UserService){}

    @ApiCookieAuth('refresh_token')
    @ApiResponse({type: UserSelfDTO})
    @UseGuards(JwtAuthGuard)
    @Get()
    async getProfile(@UserParamDecorator() user: UserModel) {
            
        return await this.usersService.validateAndGetUser(user, { password: false })
    }

    @ApiNoContentResponse()
    @ApiCookieAuth('refresh_token')
    @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(@UserParamDecorator() user: UserModel){
        await user.deleteOne()
    }

    @ApiResponse({ type: UserSelfDTO })
    @ApiCookieAuth('refresh_token')
    @UseGuards(JwtAuthGuard)
    @Patch()
    async invalidateByTime(@UserParamDecorator() user: UserModel) {
        user.valid_since = new Date()
        return await user.save()
    }
    

}
