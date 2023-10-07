import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'
import * as smtpTransport from 'nodemailer-smtp-transport'
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
    private host: string
    private port: number
    private user: string
    private password: string
    private transporter: nodemailer.Transporter
    constructor(private readonly configService: ConfigService) {
        const conf = this.configService.get.bind(this.configService)
        this.host = conf('SMTP_HOST')
        this.port = +conf('SMTP_PORT')
        this.user = conf('SMTP_USER')
        this.password = conf('SMTP_PASSWORD')
        this.transporter = nodemailer.createTransport(
            smtpTransport({
                host: this.host,
                port: this.port,
                auth: {
                    user: this.user,
                    pass: encodeURI(this.password),
                },
            })
        );
    }

    async send(options: Mail.Options){
        return this.transporter.sendMail(options)
    }
}
