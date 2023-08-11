import {Controller, Get, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt/jwt-auth.guard";
import {User} from "../utils/UserDecorator";
import {UserPublicDTO} from "../types/UserPublicDTO";
import {UsersService} from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }
    @UseGuards(JwtAuthGuard)
    @Get('myprofile')
    getProfile(@User() user: UserPublicDTO) {
        return this.usersService.findByUsername(user.username) ;
    }
}
