import { Injectable } from '@nestjs/common';
import {UserPublicDTO} from "../types/UserPublicDTO";


export class UserDTO extends UserPublicDTO{
    hashedPassword: string
    valid_since: Date
}
export class CreateUserDTO{
    username: string
    hashedPassword: string
    email?: string
}
///TODO implement db
@Injectable()
export class UsersService {
    users: UserDTO[] = [
        {
            _id: 1,
            username: 'debil',
            email: 'debil@mail.ru',
            blocked: false,
            localisation: null,
            date_registered: new Date(),
            hashedPassword: 'qwerqwe',
            valid_since: new Date()
        },
        {
            _id: 2,
            username: 'idiot',
            email: 'idiot@mail.ru',
            blocked: false,
            localisation: 'russia',
            date_registered: new Date(),
            hashedPassword: 'qwrr',
            valid_since: new Date()
        },
    ];

    async findByUsername(username: string): Promise<UserDTO | undefined> {
        return this.users.find(user => user.username === username);
    }

    async create(user: CreateUserDTO){
        const toUsers: UserDTO = {
            _id: this.users.at(-1)._id + 1,
            blocked: false,
            date_registered: new Date(),
            valid_since: new Date(),
            email: undefined,
            localisation: undefined,
            ...user}

        this.users.push(toUsers)
        const {hashedPassword, valid_since, ...tores} = this.users.at(-1)
        return tores
    }
}