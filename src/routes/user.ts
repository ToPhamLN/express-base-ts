import { routes, TYPES } from "@/constants";
import { UserController } from "@/controllers";
import { CreateUserDto, VerifyEmailDto } from "@/dtos";
import { ValidationMiddleware, AuthMiddleware } from "@/middlewares";
import { Router } from "express";
import { inject } from "inversify";

export class UserRouter {
    private router: Router = Router();

    constructor(
        @inject(TYPES.UserController) private userController: UserController,
        @inject(TYPES.AuthMiddleware) private authMiddleware: AuthMiddleware
    ) {}

    public init() {
        this.router.post(
            routes.user.register,
            ValidationMiddleware.validate(CreateUserDto),
            this.userController.register.bind(this.userController)
        );

        this.router.post(
            routes.user.verifyEmail,
            this.authMiddleware.verifyTokenEmail,
            ValidationMiddleware.validate(VerifyEmailDto),
            this.userController.verifyEmail.bind(this.userController)
        );

        this.router.post(
            routes.user.login,
            this.userController.login.bind(this.userController)
        );

        this.router.post(
            routes.user.refreshToken,
            this.authMiddleware.verifyTokenEmail,
            this.userController.refreshToken.bind(this.userController)
        );

        this.router.post(
            routes.user.logout,
            this.authMiddleware.verifyTokenEmail,
            this.userController.logout.bind(this.userController)
        );
        return this.router;
    }
}
