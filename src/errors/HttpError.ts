export abstract class HttpError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, HttpError.prototype);
        Error.captureStackTrace(this);
    }
    abstract serializeErrors(): { message: string; field?: string }[];
}
