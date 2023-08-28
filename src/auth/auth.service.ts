import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UserCreateDTO, UserHashedDTO, User, UserSelfDTO} from "../models/User";
import {Response} from "express";
import { ConfigService } from '@nestjs/config';
import { UserService } from './../users/users.service';
import { Tokens } from '../models/Tokens';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    
    async register(user: UserCreateDTO){
        const hashedPassword = await bcrypt.hash(user.password, 4)
        const {password, ...userNoPassw} = user
        const toCreate: UserHashedDTO = {
            ...userNoPassw,
            hashedPassword,
        };
        return await this.usersService.create(toCreate)
    }
    async getTokens(user: User): Promise<Tokens> {
        const userf = (await this.usersService.findByUsername(user.username)).toObject()
        const {hashedPassword, valid_since , ...toCookie} = userf
        return {
            refresh_token: this.jwtService.sign(toCookie, { expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME')}),
            access_token: this.jwtService.sign(toCookie, { expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME') })
        }
    }

}