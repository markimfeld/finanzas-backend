import { z } from 'zod';
import { MESSAGES } from '../constants/messages';

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: MESSAGES.ERROR.AUTH.CURRENT_PASSWORD_REQUIRED }),
    newPassword: z.string().min(8, { message: MESSAGES.ERROR.AUTH.PASSWORD_TOO_SHORT }),
});
