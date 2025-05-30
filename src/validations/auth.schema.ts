import { z } from 'zod';
import { MESSAGES } from '../constants/messages';

export const loginSchema = z.object({
    email: z
        .string({ required_error: MESSAGES.VALIDATION.USER.EMAIL_REQUIRED })
        .email({ message: MESSAGES.VALIDATION.USER.INVALID_EMAIL }),
    password: z
        .string({ required_error: MESSAGES.VALIDATION.USER.PASSWORD_REQUIRED })
        .min(8, { message: MESSAGES.VALIDATION.USER.PASSWORD_TOO_SHORT }),
});
