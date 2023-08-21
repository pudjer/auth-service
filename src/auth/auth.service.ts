import { Injectable } from '@nestjs/common';
import {CreateUserDTO, UsersService} from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UserPublicDTO} from "../types/UserPublicDTO";
import {IsDefined, IsString} from "class-validator";
import {Response} from "express";

export class UserRegistrationDTO{
    @IsString()
    username: string
    @IsString()
    password: string
    email?: string
}
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validate({username, password}: {username: string, password: string}): Promise<UserPublicDTO> {
        const user = await this.usersService.findByUsername(username);
        if (user && await bcrypt.compare(password, user.hashedPassword)) {
            const { valid_since, hashedPassword, ...result } = user;
            return result;
        }
        return null;
    }
    async register(user: UserRegistrationDTO){
        const hashedPassword = await bcrypt.hash(user.password, 4)
        const {password, ...userNoPassw} = user
        const toCreate: CreateUserDTO = {
            ...userNoPassw,
            hashedPassword,
        };
        return await this.usersService.create(toCreate)
    }
    async addCredentials(res: Response, user: UserPublicDTO){
        const {hashedPassword, valid_since , ...toCookie} = await this.usersService.findByUsername(user.username)
        return res.cookie('jwt', this.jwtService.sign(toCookie))
    }

}