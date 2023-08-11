import { Injectable } from '@nestjs/common';
import {UserPublicDTO} from "../types/UserPublicDTO";


export class UserDTO extends UserPublicDTO{
    hashedPassword: string
    valid_since: string
}
export class CreateUserDTO{
    username: string
    hashedPassword: string
    email: string | undefined
}
///TODO implement db
@Injectable()
export class UsersService {
    users: UserDTO[] = [
        {
            id: 1,
            username: 'debil',
            email: 'debil@mail.ru',
            blocked: false,
            localisation: null,
            date_registered: 'qwer',
            hashedPassword: 'qwerqwe',
            valid_since: 'qrwer'
        },
        {
            id: 2,
            username: 'idiot',
            email: 'idiot@mail.ru',
            blocked: false,
            localisation: 'russia',
            date_registered: 'rqwr',
            hashedPassword: 'qwrr',
            valid_since: 'rqwe'
        },
    ];

    async findByUsername(username: string): Promise<UserDTO | undefined> {
        return this.users.find(user => user.username === username);
    }

    async create(user: CreateUserDTO){
        const toUsers: UserDTO = {
            id: this.users.at(-1).id + 1,
            blocked: false,
            date_registered: (new Date()).toDateString(),
            valid_since: (new Date()).toDateString(),
            email: undefined,
            localisation: undefined,
            ...user}

        this.users.push(toUsers)
        const {hashedPassword, valid_since, ...tores} = this.users.at(-1)
        return tores
    }
}