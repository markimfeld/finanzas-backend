import { Resend } from 'resend';
import { IEmailService } from '../../interfaces/email/emailService.interface';

export class ResendEmailService implements IEmailService {
    private resend = new Resend(process.env.RESEND_API_KEY);

    async sendMail(to: string, subject: string, html: string): Promise<void> {
        await this.resend.emails.send({
            from: `Macaroni <noreply@macaroni.com>`,
            to,
            subject,
            html,
        });
    }
}
