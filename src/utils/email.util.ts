import { mailer } from "../lib/mailer";
import { generateVerificationEmailHTML } from "./emailTemplates/verificationEmail";


export async function sendEmailVerification(email: string, token: string) {

    const { subject, html } = generateVerificationEmailHTML(token)

    // Reutilizá tu sistema de mailing
    await mailer.sendMail(email, subject, html);
}
