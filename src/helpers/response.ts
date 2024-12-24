import { Response } from "express";
import { STATUS } from "@/constants";
import { configs } from "@/configs";
import { logger } from "@/helpers";

interface CookieOptions {
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | "lax" | "strict" | "none";
    domain?: string;
    path?: string;
}

export class Reply {
    protected createResponse(
        statusCode: number,
        message: string,
        data: unknown = null,
        headers: { [key: string]: string } | null = null,
        metadata: unknown = null
    ): {
        statusCode: number;
        message: string;
        data: unknown;
        headers: { [key: string]: string } | null;
        metadata: unknown;
    } {
        return {
            statusCode,
            message,
            data,
            headers,
            metadata,
        };
    }

    protected response(
        res: Response,
        reply: {
            statusCode: number;
            message: string;
            data: unknown;
            headers: { [key: string]: string } | null;
            metadata: unknown;
        }
    ): Response {
        logger.info(`${reply.statusCode} ${reply.message}`);
        if (reply.headers) {
            Object.keys(reply.headers).forEach((key) => {
                res.setHeader(key, reply.headers![key]);
            });
        }

        return res.status(reply.statusCode).json({
            success: reply.statusCode >= 200 && reply.statusCode < 300,
            message: reply.message,
            data: reply.data,
            metadata: reply.metadata,
        });
    }

    protected success(
        res: Response,
        message: string,
        data: unknown,
        metadata?: unknown
    ): Response {
        logger.info(`${STATUS.SUCCESS} ${message}`);
        const reply = this.createResponse(
            STATUS.SUCCESS,
            message,
            data,
            null,
            metadata
        );
        return this.response(res, reply);
    }

    protected created(
        res: Response,
        message: string,
        data: unknown,
        metadata?: unknown
    ): Response {
        logger.info(`${STATUS.CREATED} ${message}`);
        const reply = this.createResponse(
            STATUS.CREATED,
            message,
            data,
            null,
            metadata
        );
        return this.response(res, reply);
    }

    protected cookie(
        res: Response,
        name: string,
        value: string,
        options?: CookieOptions
    ): Response {
        const optionDefault: CookieOptions = {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            httpOnly: true,
            secure: configs.nodeEnv === "production",
            sameSite: "lax",
            path: "/",
        };

        const finalOptions: CookieOptions = { ...optionDefault, ...options };
        return res.cookie(name, value, finalOptions);
    }
}

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
