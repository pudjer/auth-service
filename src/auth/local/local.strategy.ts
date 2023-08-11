import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthService } from '../auth.service';
import {UserPublicDTO} from "../../types/UserPublicDTO";
import {Request} from "express";
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../../users/users.service";
let a = 0
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async authenticate(req: Request<{ username: string, password: string }>) {
        const user = await this.authService.validate(req.body);
        if (!user) {
            this.fail(401)
        }
        this.success(user)
    }

}
