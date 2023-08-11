import {Request} from "express";

export class UserPublicDTO {
    id: number
    username: string
    email: string | undefined
    blocked: boolean
    localisation: string | undefined
    date_registered: string
}
