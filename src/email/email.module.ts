import {  Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ConfigurableModuleClass } from "./moduleDefinition";


@Module({
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule extends ConfigurableModuleClass { }