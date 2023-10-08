import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface EmailModuleOptions {
    host: string
    port: number
    password: string
    user: string
    from: string
}


export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
    new ConfigurableModuleBuilder<EmailModuleOptions>().build();