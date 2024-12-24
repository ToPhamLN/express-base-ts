import { configs } from "@/configs";
import { STATUS } from "@/constants";
import { Exception } from "@/helpers";
import { NextFunction, Request, Response } from "express";
import { CastError } from "mongoose";

export class ErrorMiddleware {
    static notFound(req: Request, res: Response, next: NextFunction): void {
        const error = new Exception(
            STATUS.NOT_FOUND,
            `${req.originalUrl} not found`
        );
        next(error);
    }

    static handler(
        error: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ): Response {
        let statusCode: number =
            (error as Exception).statusCode || STATUS.NOT_FOUND;
        let message: string = error.message;
        const errors = (error as Exception).errors;
        const stack =
            configs.nodeEnv === "development"
                ? ((error as Exception).stack ?? error.stack)
                : null;

        if (
            error.name === "CastError" &&
            (error as CastError).kind === "ObjectId"
        ) {
            statusCode = STATUS.NOT_FOUND;
            message = "Resource not found";
        }

        if (typeof errors === "string") {
            return res.status(statusCode).json({
                success: false,
                message,
                errorCode: errors,
                ...(stack && { stack }),
            });
        }

        return res.status(statusCode).json({
            success: false,
            message,
            errors,
            ...(stack && { stack }),
        });
    }
}
