import { COOKIE_REFRESH_TOKEN, TYPES } from "@/constants";
import { Exception, Reply } from "@/helpers";
import { AuthService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AuthController extends Reply {
    constructor(@inject(TYPES.UserService) private _authService: AuthService) {
        super();
    }

    public async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this._authService.createUser(req.body);

            this.cookie(res, COOKIE_REFRESH_TOKEN, user.refreshToken);
            return this.success(res, "user:register.success", user, null);
        } catch (error) {
            next(error);
        }
    }

    public async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = res.locals.decoded;
            if (!userId || userId !== req.body._id)
                throw Exception.unauthorized(
                    "user:verify_email.user_incorrect"
                );

            const user = await this._authService.verifyOTP(req.body);

            return this.success(res, "user:verify_email.success", user, null);
        } catch (error) {
            next(error);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this._authService.login(req.body);

            this.cookie(res, COOKIE_REFRESH_TOKEN, user.refreshToken);
            return this.success(res, "user:login.success", user, null);
        } catch (error) {
            next(error);
        }
    }

    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies[COOKIE_REFRESH_TOKEN];

            const user = await this._authService.refreshToken(refreshToken);

            this.cookie(res, COOKIE_REFRESH_TOKEN, user.refreshToken);
            return this.success(res, "user:refresh_token.success", null, null);
        } catch (error) {
            next(error);
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction) {
        try {
            this.cookie(res, COOKIE_REFRESH_TOKEN, "");
            return this.success(res, "user:logout.success", null, null);
        } catch (error) {
            next(error);
        }
    }
}
