export function generateVerificationEmailHTML(token: string): { subject: string; html: string } {
    const verificationUrl = `${process.env.FRONTEND_URL}/api/auth/verify-email/${token}`;
    const subject = 'Verificá tu dirección de correo';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Confirmá tu dirección de correo</h2>
        <p style="font-size: 16px; color: #555;">
          Gracias por registrarte. Por favor, confirmá tu dirección de correo electrónico haciendo clic en el siguiente botón:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Verificar correo
          </a>
        </div>
        <p style="font-size: 14px; color: #888;">
          Si vos no creaste esta cuenta, podés ignorar este mensaje.
        </p>
      </div>
    `;

    return { subject, html };
}
