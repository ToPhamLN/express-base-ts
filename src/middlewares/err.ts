import { configs } from "@/configs";
import { STATUS } from "@/constants";
import { Exception } from "@/helpers";
import { NextFunction, Request, Response } from "express";
import { CastError } from "mongoose";

export class ErrorMiddleware {
    static notFound(req: Request, res: Response, next: NextFunction): void {
        const error = new Exception(
            STATUS.NOT_FOUND,
            `${req.originalUrl} ${req.t("common:not_found")}`
        );
        next(error);
    }

    static handler(
        error: Error,
        req: Request,
        res: Response,
        _next: NextFunction
    ): Response {
        let statusCode: number =
            (error as Exception).statusCode ?? STATUS.NOT_FOUND;
        let message: string =
            req.t((error as Exception).message) ?? error.message;
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

        return res.status(statusCode).json({
            success: false,
            message,
            ...(typeof errors === "string"
                ? { errorCode: errors }
                : { errors }),
            ...(stack && { stack }),
        });
    }
}
