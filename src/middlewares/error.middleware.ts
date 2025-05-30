import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { HttpError } from "../errors/HttpError";
import { MESSAGES } from "../constants/messages";

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
        errors: [{ message: MESSAGES.ERROR.GENERAL.INTERNAL_SERVER }],
    });
    return;
};
