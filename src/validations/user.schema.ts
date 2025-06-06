import { z } from "zod";
import { MESSAGES } from "../constants/messages";
import { USER_ROLES } from "../interfaces/common/roles.interface";

export const createUserSchema = z.object({
    name: z
        .string({ required_error: MESSAGES.VALIDATION.USER.NAME_REQUIRED })
        .min(1, { message: MESSAGES.VALIDATION.USER.NAME_REQUIRED }),
    email: z
        .string({ required_error: MESSAGES.VALIDATION.USER.EMAIL_REQUIRED })
        .email({ message: MESSAGES.VALIDATION.USER.INVALID_EMAIL }),
    passwordHash: z
        .string({ required_error: MESSAGES.VALIDATION.USER.PASSWORD_REQUIRED })
        .min(8, { message: MESSAGES.VALIDATION.USER.PASSWORD_TOO_SHORT }),
    role: z.enum([USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.VIEWER], { message: MESSAGES.VALIDATION.USER.INVALID_ROLE }).optional().default(USER_ROLES.USER)
});

export const updateUserSchema = z.object({
    name: z.string()
        .min(1, { message: MESSAGES.VALIDATION.USER.NAME_REQUIRED }).optional(),
    email: z.string()
        .email({ message: MESSAGES.VALIDATION.USER.INVALID_EMAIL }).optional(),
    role: z.enum([USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.VIEWER], { message: MESSAGES.VALIDATION.USER.INVALID_ROLE }).optional(),
});