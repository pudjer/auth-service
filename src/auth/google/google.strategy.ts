import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";


//TODO
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({

        })
    }
    async validate(){
        return
    }
}