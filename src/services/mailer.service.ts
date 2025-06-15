// src/services/mailer.service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: true, // true para 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const mailer = {
    async send(to: string, subject: string, html: string) {
        await transporter.sendMail({
            from: `"Finances App" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
    },
};
