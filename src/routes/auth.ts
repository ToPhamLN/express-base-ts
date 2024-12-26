import { routes, TYPES } from "@/constants";
import { AuthController } from "@/controllers";
import { CreateUserDto, VerifyEmailDto } from "@/dtos";
import { ValidationMiddleware, AuthMiddleware } from "@/middlewares";
import { Router } from "express";
import { inject } from "inversify";

export class AuthRouter {
    private router: Router = Router();

    constructor(
        @inject(TYPES.UserController) private _authController: AuthController,
        @inject(TYPES.AuthMiddleware) private _authMiddleware: AuthMiddleware,
        @inject(TYPES.ValidationMiddleware)
        private _validationMiddleware: ValidationMiddleware
    ) {}

    public init() {
        this.router.post(
            routes.user.register,
            this._validationMiddleware.validate(CreateUserDto),
            this._authController.register.bind(this._authController)
        );

        this.router.post(
            routes.user.verifyEmail,
            this._authMiddleware.verifyTokenEmail,
            this._validationMiddleware.validate(VerifyEmailDto),
            this._authController.verifyEmail.bind(this._authController)
        );

        this.router.post(
            routes.user.login,
            this._authController.login.bind(this._authController)
        );

        this.router.post(
            routes.user.refreshToken,
            this._authMiddleware.verifyTokenEmail,
            this._authController.refreshToken.bind(this._authController)
        );

        this.router.post(
            routes.user.logout,
            this._authMiddleware.verifyTokenEmail,
            this._authController.logout.bind(this._authController)
        );
        return this.router;
    }
}
