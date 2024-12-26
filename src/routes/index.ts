import { routes, TYPES } from "@/constants";
import { container } from "@/configs";
import { Application } from "express";
import { UserRouter } from "./user";
import { AuthRouter } from "./auth";

const defineRotes = (app: Application) => {
    const userRoutes = container.get<UserRouter>(TYPES.UserRouter);
    const authRoutes = container.get<AuthRouter>(TYPES.AuthRouter);

    app.use(routes.auth.root, authRoutes.init());
    app.use(routes.user.root, userRoutes.init());
};

export default defineRotes;
export * from "./user";
export * from "./auth";
