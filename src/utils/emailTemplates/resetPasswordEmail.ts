export function generateResetPasswordEmailHTML(token: string): { subject: string; html: string } {
    const verificationUrl = `${process.env.FRONTEND_URL}/api/auth/reset-password/${token}`;
    const subject = 'Restablecer contraseña';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Confirmá tu dirección de correo</h2>
        <p style="font-size: 16px; color: #555;">
          Hacé clic en el siguiente enlace para restablecer tu contraseña:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Reestablecer contraseña
          </a>
        </div>
        <p style="font-size: 14px; color: #888;">
          Si vos no pediste reestablecer, podés ignorar este mensaje.
        </p>
      </div>
    `;

    return { subject, html };
}
