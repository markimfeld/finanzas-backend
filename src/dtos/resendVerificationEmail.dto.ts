import { z } from 'zod';
import { MESSAGES } from '../constants/messages';

export const ResendVerificationEmailSchema = z.object({
    email: z.string({ required_error: MESSAGES.VALIDATION.USER.EMAIL_REQUIRED }).email(MESSAGES.VALIDATION.USER.INVALID_EMAIL),
});

export type ResendVerificationEmailDto = z.infer<typeof ResendVerificationEmailSchema>;
