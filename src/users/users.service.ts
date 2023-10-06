import { ForbiddenException, Injectable } from '@nestjs/common';
import {UserCreateDTO, User, UserHashedDTO, UserPublicDTO, UserSelfDTO, UserLoginDTO, UserModel} from "../models/User";
import { Document, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { validate, validateOrReject } from 'class-validator';
import { UnauthorizedException } from '@nestjs/common';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    async findByUsername(username: string){
        const res = await this.userModel.findOne({ username: username }).exec();
        return res
    }

    async create(user: UserHashedDTO){
        const createdUserDTO = new this.userModel(user);
        const res = await createdUserDTO.save();
        return res;
    }
    
    validateAndGetUser<T, J>(cred: T, options?: {password: J}): T extends Credentials ? Promise<UserModel> : T extends { username: string } ? J extends false ? Promise<UserModel> : never : never
    async validateAndGetUser(toValidate: {username: string, password?: string}, options?: {password: boolean}){
        const user = await this.findByUsername(toValidate.username);
        if(!user) throw new UnauthorizedException()
        if(options?.password){
            if (!await bcrypt.compare(toValidate.password, user.hashedPassword)) {
               throw new UnauthorizedException() 
            } 
        }
        if(user.blocked) throw new ForbiddenException() 
        return user
    }
    
    
    
    
    
}
type Credentials = { password: string, username: string } 