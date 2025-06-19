import { z } from "zod";
import { MESSAGES } from "../constants/messages";
import { getStrongPasswordSchema } from "../utils/password.validator";

export const loginSchema = z.object({
    email: z
        .string({ required_error: MESSAGES.VALIDATION.USER.EMAIL_REQUIRED })
        .email({ message: MESSAGES.VALIDATION.USER.INVALID_EMAIL }),
    password: getStrongPasswordSchema(),
});
