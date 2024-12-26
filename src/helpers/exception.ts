import { STATUS } from "@/constants";
import { logger } from "@/helpers";

export class Exception extends Error {
    statusCode: number;
    message: string;
    errors: unknown | null;
    stackTrace: string | undefined;

    constructor(
        statusCode: number,
        message: string,
        errors: unknown | null = null
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        logger.error(`${this.statusCode} ${this.message}`);
        Error.captureStackTrace(this, this.constructor);
    }

    static notFound(message: string = "Resource not found"): Exception {
        return new Exception(STATUS.NOT_FOUND, message, "NOT_FOUND");
    }

    static unauthorized(message: string = "Unauthorized access"): Exception {
        return new Exception(STATUS.UN_AUTHORIZED, message, "UNAUTHORIZED");
    }

    static forbidden(message: string = "Forbidden access"): Exception {
        return new Exception(STATUS.FORBIDDEN, message, "FORBIDDEN");
    }

    static internalServerError(
        message: string = "Internal server error"
    ): Exception {
        return new Exception(STATUS.SERVER_ERROR, message, "SERVER_ERROR");
    }

    static badRequest(message: string = "Bad request"): Exception {
        return new Exception(STATUS.BAD_REQUEST, message, "BAD_REQUEST");
    }

    static conflict(message: string = "Conflict"): Exception {
        return new Exception(STATUS.CONFLICT, message, "CONFLICT");
    }
}
