// src/validations/updateProfile.schema.ts
import { z } from 'zod';
import { MESSAGES } from "../constants/messages";
import { USER_ROLES } from "../interfaces/common/roles.interface";

export const updateProfileSchema = z.object({
    name: z.string()
        .min(1, { message: MESSAGES.VALIDATION.USER.NAME_REQUIRED }).optional(),
    email: z.string()
        .email({ message: MESSAGES.VALIDATION.USER.INVALID_EMAIL }).optional()
});