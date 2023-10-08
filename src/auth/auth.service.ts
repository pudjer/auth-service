import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UserCreateDTO, UserHashedDTO, User, UserSelfDTO} from "../models/User";
import {Response} from "express";
import { ConfigService } from '@nestjs/config';
import { UserService } from './../users/users.service';
import { Tokens } from '../models/Tokens';
import { EmailService } from '../email/email.service';
import * as uuid from 'uuid';
import { striper } from '../helpers/stripper';
import { privateAttributesWithoutPassword } from '../config/variables';


type JWTEmailPayload = {
    username: string,
    email: string,
    emailToken: string,
}

@Injectable()
export class AuthService {
    refreshExpTime: string
    accessExpTime: string
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private emailService: EmailService,
        @Inject('EMAIL_FUNC') private emailFunc: (token: string)=>string
    ) {
        this.refreshExpTime = this.configService.get('JWT_REFRESH_EXPIRATION_TIME')
        this.accessExpTime = this.configService.get('JWT_ACCESS_EXPIRATION_TIME')
    }

    async regEmail(username: string, email: string){
        const emailToken = uuid.v4();
        const payload: JWTEmailPayload = { username, email, emailToken }
        const jwtToken = this.jwtService.sign(
            payload,
            { expiresIn: this.refreshExpTime });
        
        await this.emailService.send({
            to: email,
            subject: 'Email Verification',
            text: this.emailFunc(jwtToken)
        })
        const user = await this.usersService.setAttributes(username, { emailToken }) 
    }

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
        const toCookie = striper(privateAttributesWithoutPassword)(userf)
        return {
            refresh_token: this.jwtService.sign(toCookie, { expiresIn: this.refreshExpTime}),
            access_token: this.jwtService.sign(toCookie, { expiresIn: this.accessExpTime })
        }
    }

}