import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;


export @Schema()
class UserModel{
    @Prop({type: ()=> String})
    hashedPassword: string
    @Prop({type: ()=> Date})
    valid_since: string
    @Prop({type: ()=> String})
    username: string
    @Prop({type: ()=> String})
    email: string | undefined
    @Prop({type: ()=> Boolean})
    blocked: boolean
    @Prop({type: ()=> String})
    localisation: string | undefined
    @Prop({type: ()=> Date})
    date_registered: string

}

export const UserScheme = SchemaFactory.createForClass(UserModel);