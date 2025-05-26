import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../constants/messages';

export const createUserSchema = z.object({
  name: z.string().min(1, { message: VALIDATION_MESSAGES.USER.NAME_REQUIRED }),
  email: z.string().email({ message: VALIDATION_MESSAGES.USER.INVALID_EMAIL }),
  passwordHash: z.string().min(8, { message: VALIDATION_MESSAGES.USER.PASSWORD_TOO_SHORT }),
});
