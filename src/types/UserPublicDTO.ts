import {Request} from "express";

export class UserPublicDTO {
    _id: number
    username: string
    email?: string
    blocked: boolean
    localisation?: string
    date_registered: Date
}
