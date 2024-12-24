import { configs } from "@/configs";
import { Exception } from "@/helpers";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { UserRepository } from "@/repositories";
import { Response, Request, NextFunction } from "express";
import { ERole, EUserStatus } from "@/constants";
import { inject, injectable } from "inversify";
import { TYPES } from "@/constants";

@injectable()
export class AuthMiddleware {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository
    ) {}

    public verifyTokenEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const token: string | undefined = req.headers.token as string;
            if (!token) throw Exception.unauthorized("Token is required");
            const accessToken = token.split(" ")[1];

            jwt.verify(
                accessToken,
                configs.jwt.accessSecret,
                async (err: VerifyErrors | null, auth: any) => {
                    if (err) throw Exception.unauthorized("Token is invalid");
                    const existed = await this.userRepository.findUserById(
                        auth.userId
                    );
                    if (auth && !existed)
                        throw Exception.unauthorized("User are not allowed");
                    res.locals.decoded = auth;
                    next();
                }
            );
        } catch (error) {
            next(error);
        }
    }

    public verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            this.verifyTokenEmail(req, res, () => {
                const { status } = res.locals.decoded.user;
                if (status !== EUserStatus.ACTIVE)
                    throw Exception.forbidden("User is not active");
                next();
            });
        } catch (error) {
            next(error);
        }
    }

    static guard(roles: ERole[] = []) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { role } = res.locals.decoded.user;
                if (!roles.includes(role)) {
                    throw Exception.forbidden(
                        "You do not have permission to access this resource"
                    );
                }
                next();
            } catch (error) {
                next(error);
            }
        };
    }
}
