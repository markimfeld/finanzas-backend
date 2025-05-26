import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/HttpError";

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            errors: err.serializeErrors(),
        });
    }

    // Manejo genérico
    console.error("[Unhandled Error]", err);

    return res.status(500).json({
        errors: [{ message: "Internal Server Error" }],
    });
};
