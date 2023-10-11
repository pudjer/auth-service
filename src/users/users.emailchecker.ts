import { Injectable } from "@nestjs/common";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";


export class EmailCheckCommand{
    constructor(
        public readonly email
    ){}
}


@CommandHandler(EmailCheckCommand)
export class EmailCheckHandler implements ICommandHandler<EmailCheckCommand> {

    async execute(command: EmailCheckCommand) {
        
    }
}