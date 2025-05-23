export class HttpError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype); // Corrige el prototipo
        Error.captureStackTrace(this);
    }
}
