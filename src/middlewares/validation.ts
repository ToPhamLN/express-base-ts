import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { Exception } from "@/helpers";
import { STATUS } from "@/constants";
import { injectable } from "inversify";

@injectable()
export class ValidationMiddleware {
    public validate(
        bodyClass?: new (...args: unknown[]) => object,
        queryClass?: new (...args: unknown[]) => object,
        paramsClass?: new (...args: unknown[]) => object
    ) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const errors: ValidationError[] = [];
                if (bodyClass) {
                    const bodyInstance = plainToInstance(bodyClass, req.body, {
                        excludeExtraneousValues: true,
                    });
                    const bodyErrors = await validate(bodyInstance);
                    if (bodyErrors.length > 0) {
                        errors.push(...bodyErrors);
                    }
                }

                if (queryClass) {
                    const queryInstance = plainToInstance(
                        queryClass,
                        req.query,
                        {
                            excludeExtraneousValues: true,
                        }
                    );
                    const queryErrors = await validate(queryInstance);
                    if (queryErrors.length > 0) {
                        errors.push(...queryErrors);
                    }
                }

                if (paramsClass) {
                    const paramsInstance = plainToInstance(
                        paramsClass,
                        req.params
                    );
                    const paramsErrors = await validate(paramsInstance);
                    if (paramsErrors.length > 0) {
                        errors.push(...paramsErrors);
                    }
                }

                if (errors.length > 0) {
                    throw new Exception(
                        STATUS.BAD_REQUEST,
                        "Validation failed",
                        errors
                    );
                }

                next();
            } catch (error) {
                next(error);
            }
        };
    }
}
