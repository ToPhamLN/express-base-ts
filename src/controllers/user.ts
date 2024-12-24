import { COOKIE_REFRESH_TOKEN, TYPES } from "@/constants";
import { Exception, Reply } from "@/helpers";
import { UserService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class UserController extends Reply {
    constructor(@inject(TYPES.UserService) private userService: UserService) {
        super();
    }

    public async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.createUser(req.body);

            this.cookie(res, COOKIE_REFRESH_TOKEN, user.refreshToken);
            return this.success(res, "User created successfully", user);
        } catch (error) {
            next(error);
        }
    }

    public async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.decoded;
            if (!userId || userId !== req.body._id)
                throw Exception.unauthorized("User id is not correct");

            const user = await this.userService.verifyOTP(req.body);

            return this.success(res, "Email verified successfully", user);
        } catch (error) {
            next(error);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.login(req.body);

            this.cookie(res, COOKIE_REFRESH_TOKEN, user.refreshToken);
            return this.success(res, "User logged in successfully", user, null);
        } catch (error) {
            next(error);
        }
    }

    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies[COOKIE_REFRESH_TOKEN];

            const user = await this.userService.refreshToken(refreshToken);

            this.cookie(res, COOKIE_REFRESH_TOKEN, user.refreshToken);
            return this.success(res, "User logged in successfully", null);
        } catch (error) {
            next(error);
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction) {
        try {
            this.cookie(res, COOKIE_REFRESH_TOKEN, "");
            return this.success(res, "User logged out successfully", null);
        } catch (error) {
            next(error);
        }
    }
}
