import { z } from 'zod';
import { MESSAGES } from '../constants/messages';

export const createUserSchema = z.object({
  name: z.string({ required_error: MESSAGES.VALIDATION.USER.NAME_REQUIRED }).min(1, { message: MESSAGES.VALIDATION.USER.NAME_REQUIRED }),
  email: z.string({ required_error: MESSAGES.VALIDATION.USER.EMAIL_REQUIRED }).email({ message: MESSAGES.VALIDATION.USER.INVALID_EMAIL }),
  passwordHash: z.string({ required_error: MESSAGES.VALIDATION.USER.PASSWORD_REQUIRED }).min(8, { message: MESSAGES.VALIDATION.USER.PASSWORD_TOO_SHORT }),
});