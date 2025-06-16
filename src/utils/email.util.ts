import { mailer } from "../lib/mailer";


export async function sendEmailVerification(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/api/auth/verify-email/${token}`;
    const subject = 'Verify your email';
    const html = `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`;

    // Reutilizá tu sistema de mailing
    await mailer.sendMail(email, subject, html);
}
