import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { HydratedDocument } from "mongoose";

export type LocationModel = HydratedDocument<Location>
@Schema({versionKey: false})
export class Location{
    @ApiProperty({type: String})
    @IsString()
    @Prop({type: () => String })
    name: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);