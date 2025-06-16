import { NodemailerEmailService } from '../services/email/nodemailerEmailService';
// import { ResendEmailService } from '../services/email/resendEmailService'; // futuro

// export const mailer = new ResendEmailService();
export const mailer = new NodemailerEmailService();