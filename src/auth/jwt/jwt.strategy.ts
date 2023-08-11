import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {UserPublicDTO} from "../../types/UserPublicDTO";
import {Request} from "express";
import {JwtService} from "@nestjs/jwt";


const cookieExtractor = (req: Request) =>{
    if('cookies' in req){
        return req.cookies['jwt']
    }
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService, private readonly jwtService: JwtService) {
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: true,
            secretOrKey: configService.get('SECRET_KEY'),
        });
    }

    async validate(cookie: UserPublicDTO & {iat: number, exp: number}) {
        const currentTime = Math.round((new Date()).getTime()/1000)
        if(cookie.exp + 60*60*24*30 < currentTime){throw new UnauthorizedException()}
        const {iat, exp, ...user} = cookie
        return user;
    }
}