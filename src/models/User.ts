import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiPropertyOptional, IntersectionType, OmitType, PickType } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsISO8601, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Schema } from "@nestjs/mongoose";
import { Location } from "./Location";
import { Type } from "class-transformer";
import { HydratedDocument } from "mongoose";




@Schema({ versionKey: false })
export class User{

    @MaxLength(25)
    @ApiProperty({type: String, maxLength: 25})
    @Prop({ type: () => String, required: true, unique: true})
    @IsString()
    username: string

    @ApiPropertyOptional({ type: String })
    @Prop({ type: () => String, unique: true })
    @IsEmail()
    @IsOptional()
    email?: string

    @ApiProperty({ type: String })
    _id: number

    @ApiProperty({type: Boolean})
    @IsBoolean()
    @Prop({ type: () => Boolean, default: false })
    blocked: boolean

    @ApiPropertyOptional({ type: Location })
    @Prop({ type: 'ObjectId', ref: Location.name })
    @ValidateNested()
    @Type(() => Location)
    localisation?: string

    @ApiProperty({type: Date})
    @Prop({ type: () => Date, default: () => new Date() })
    @IsISO8601()
    date_registered: Date


    @IsString()
    @Prop({ type: () => String, required: true })
    hashedPassword: string
    
    @ApiProperty({ type: Date })
    @IsISO8601()
    @Prop({ type: () => Date, default: () => new Date() })
    valid_since: Date
}

export class UserSelfDTO extends OmitType(
    User,
    ['hashedPassword'] as const
    ) {}

export class UserPublicDTO extends OmitType(
    UserSelfDTO,
    ['blocked', 'localisation', 'valid_since'] as const
    ) {}

export class UserCreateDTO extends PickType(
    UserSelfDTO,
    ['username','email','localisation'] as const
    ) {
    
    @MaxLength(60)
    @MinLength(8)
    @ApiProperty({ type: String, maxLength: 60, minLength: 8 })
    @IsString()
    password: string

}

export class UserLoginDTO extends PickType(
    UserCreateDTO,
    ['username', 'password'] as const
) {}

export class UserHashedDTO extends IntersectionType(
    PickType(User, ['hashedPassword']),
    OmitType(UserCreateDTO, ['password'])
    ) {}

export type UserModel = HydratedDocument<User>
export const UserScheme = SchemaFactory.createForClass(User);