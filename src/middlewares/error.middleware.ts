import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { HttpError } from "../errors/HttpError";
import { ERROR_MESSAGES } from "../constants/messages";

export const errorHandler: ErrorRequestHandler = (
    err,
    _req,
    res,
    _next
) => {
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({
            errors: err.serializeErrors(),
        });
        return;
    }

    // Manejo genérico
    console.error("[Unhandled Error]", err);

    res.status(500).json({
        errors: [{ message: ERROR_MESSAGES.GENERAL.INTERNAL_SERVER }],
    });
    return;
};
