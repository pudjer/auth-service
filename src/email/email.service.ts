import { ConfigurableModuleBuilder, Inject, Injectable, forwardRef } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import * as smtpTransport from 'nodemailer-smtp-transport'
import Mail from 'nodemailer/lib/mailer';
import { EmailModuleOptions, MODULE_OPTIONS_TOKEN } from './moduleDefinition';


@Injectable()
export class EmailService {
    private host: string
    private port: number
    private user: string
    private password: string
    private from: string
    private transporter: nodemailer.Transporter
    constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: EmailModuleOptions) {
        const {host, port, from, password, user} = options
        const pass = encodeURI(password)
        this.from = from
        this.transporter = nodemailer.createTransport(
            smtpTransport({
                host, port, auth: {user, pass}
            })
        );
    }

    async send(options: Mail.Options){
        return this.transporter.sendMail({...options, from: this.from})
    }
}

