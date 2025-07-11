import { MESSAGES } from '../constants/messages';
import mongoose from 'mongoose';
import { z } from "zod";


export const objectIdValidator = z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: MESSAGES.VALIDATION.GENERAL.INVALID_OBJECT_ID,
    });