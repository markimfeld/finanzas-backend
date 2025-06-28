import { z } from 'zod';
import { MESSAGES } from '../constants/messages';
import { getStrongPasswordSchema } from '../utils/password.validator';

export const resetPasswordSchema = z.object({
    newPassword: getStrongPasswordSchema(),
});