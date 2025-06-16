import nodemailer from 'nodemailer';
import { IEmailService } from '../../interfaces/email/emailService.interface';

export class NodemailerEmailService implements IEmailService {
    private transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: true, // true para 465, false para otros puertos
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    async sendMail(to: string, subject: string, html: string): Promise<void> {
        await this.transporter.sendMail({
            from: `"Finances App" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
    }
}
