import { routes, TYPES } from "@/constants";
import { container } from "@/container";
import { Application } from "express";
import { UserRouter } from "./user";

const userRoutes = container.get<UserRouter>(TYPES.UserRouter);

const defineRotes = (app: Application) => {
    app.use(routes.user.root, userRoutes.init());
};

export default defineRotes;
