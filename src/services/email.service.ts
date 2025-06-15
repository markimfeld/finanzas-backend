import { Resend } from 'resend';
import { MESSAGES } from '../constants/messages';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
    static async sendVerificationEmail(to: string, token: string) {
        const verifyUrl = `${process.env.FRONTEND_URL}/api/auth/verify-email/${token}`;
        const subject = 'Verify your email';
        const html = `
      <p>Click the link below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `;

        try {
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL!,
                to,
                subject,
                html,
            });
        } catch (error) {
            console.error('Error sending verification email', error);
            throw new Error(MESSAGES.ERROR.AUTH.SEND_FAILED);
        }
    }
}
