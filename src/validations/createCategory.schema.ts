import { MESSAGES } from "../constants/messages";
import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string({ required_error: MESSAGES.VALIDATION.CATEGORY.NAME })
        .min(1, { message: MESSAGES.VALIDATION.CATEGORY.NAME })
});