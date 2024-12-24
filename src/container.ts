import { TYPES } from "@/constants";
import { UserController } from "@/controllers";
import { UserRepository } from "@/repositories";
import { UserService } from "@/services";
import { Container } from "inversify";
import { UserRouter } from "./routes/user";
import { AuthMiddleware } from "@/middlewares";

const container = new Container();

container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<UserRouter>(TYPES.UserRouter).to(UserRouter);

export { container };
