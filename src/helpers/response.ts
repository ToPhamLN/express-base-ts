import { Response } from "express";
import { STATUS } from "@/constants";
import { configs } from "@/configs";
import { logger } from "@/helpers";
import { TFunction } from "i18next";

interface CookieOptions {
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | "lax" | "strict" | "none";
    domain?: string;
    path?: string;
}

export class Reply {
    protected response(
        res: Response,
        statusCode: number,
        message: string,
        data: unknown = null,
        headers: { [key: string]: string } | null = null,
        metadata: unknown = null
    ): Response {
        const messageSend =
            res?.locals?.t && res?.locals?.t(message)
                ? res?.locals?.t(message)
                : message;
        logger.info(`${statusCode} ${message}`);
        if (headers) {
            Object.keys(headers).forEach((key) => {
                res.setHeader(key, headers[key]);
            });
        }
        return res.status(statusCode).json({
            success: statusCode >= 200 && statusCode < 300,
            message: messageSend,
            data: data,
            metadata: metadata,
        });
    }
    protected success(
        res: Response,
        message: string,
        data: unknown,
        metadata?: unknown
    ): Response {
        return this.response(
            res,
            STATUS.SUCCESS,
            message,
            data,
            null,
            metadata
        );
    }
    protected created(
        res: Response,
        message: string,
        data: unknown,
        metadata?: unknown
    ): Response {
        return this.response(
            res,
            STATUS.CREATED,
            message,
            data,
            null,
            metadata
        );
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
