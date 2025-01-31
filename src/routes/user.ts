import { routes, TYPES } from "@/constants";
import { UserController } from "@/controllers";
import { CreateUserDto, VerifyEmailDto } from "@/dtos";
import { ValidationMiddleware, AuthMiddleware } from "@/middlewares";
import { Router } from "express";
import { inject } from "inversify";

export class UserRouter {
    private router: Router = Router();

    constructor(
        @inject(TYPES.UserController) private _userController: UserController,
        @inject(TYPES.AuthMiddleware) private _authMiddleware: AuthMiddleware,
        @inject(TYPES.ValidationMiddleware)
        private _validationMiddleware: ValidationMiddleware
    ) {}

    public init() {
        this.router.post(
            routes.user.register,
            this._validationMiddleware.validate(CreateUserDto),
            this._userController.register.bind(this._userController)
        );

        this.router.post(
            routes.user.verifyEmail,
            this._authMiddleware.verifyTokenEmail,
            this._validationMiddleware.validate(VerifyEmailDto),
            this._userController.verifyEmail.bind(this._userController)
        );

        this.router.post(
            routes.user.login,
            this._userController.login.bind(this._userController)
        );

        this.router.post(
            routes.user.refreshToken,
            this._authMiddleware.verifyTokenEmail,
            this._userController.refreshToken.bind(this._userController)
        );

        this.router.post(
            routes.user.logout,
            this._authMiddleware.verifyTokenEmail,
            this._userController.logout.bind(this._userController)
        );
        return this.router;
    }
}
