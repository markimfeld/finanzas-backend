import { HttpError } from "./HttpError";

export class BadRequestError extends HttpError {
    statusCode = 400;
    constructor(
        message: string,
        public details?: { message: string; field?: string }[]
    ) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return this.details || [{ message: this.message }];
    }
}

export class UnauthorizedError extends HttpError {
    statusCode = 401;
    constructor(
        message: string,
        public details?: { message: string; field?: string }[]
    ) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return this.details || [{ message: this.message }];
    }
}

export class ForbiddenError extends HttpError {
    statusCode = 403;
    constructor(
        message: string,
        public details?: { message: string; field?: string }[]
    ) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return this.details || [{ message: this.message }];
    }
}

export class NotFoundError extends HttpError {
    statusCode = 404;
    constructor(
        message: string,
        public details?: { message: string; field?: string }[]
    ) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return this.details || [{ message: this.message }];
    }
}

export class ConflictError extends HttpError {
    statusCode = 409;
    constructor(
        message: string,
        public details?: { message: string; field?: string }[]
    ) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return this.details || [{ message: this.message }];
    }
}

export class InternalServerError extends HttpError {
    statusCode = 500;
    constructor(
        message: string,
        public details?: { message: string; field?: string }[]
    ) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return this.details || [{ message: this.message }];
    }
}
