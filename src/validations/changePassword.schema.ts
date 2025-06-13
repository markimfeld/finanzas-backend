import { z } from 'zod';
import { MESSAGES } from '../constants/messages';
import { getStrongPasswordSchema } from '../utils/password.validator';

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: MESSAGES.ERROR.AUTH.CURRENT_PASSWORD_REQUIRED }),
    newPassword: getStrongPasswordSchema(),
});
