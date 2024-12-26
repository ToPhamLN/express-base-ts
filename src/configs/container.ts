import { TYPES } from "@/constants";
import { UserController, AuthController } from "@/controllers";
import { UserRepository } from "@/repositories";
import { UserService, AuthService, AppContextService } from "@/services";
import { Container } from "inversify";
import { AuthRouter, UserRouter } from "@/routes";
import { AuthMiddleware, ValidationMiddleware } from "@/middlewares";
import { SocketConfig, MongoDBConfig } from "@/configs";
import { SocketHandlers, UserSocket } from "@/socket";
import RedisClient from "./redis";

const container = new Container({
    autoBindInjectable: true,
    defaultScope: "Singleton",
});

// Middleware bindings
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
container
    .bind<ValidationMiddleware>(TYPES.ValidationMiddleware)
    .to(ValidationMiddleware);

// Repository bindings
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);

// Service bindings
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container
    .bind<AppContextService>(TYPES.AppContextService)
    .to(AppContextService);

// Controller bindings
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

// Router bindings
container.bind<UserRouter>(TYPES.UserRouter).to(UserRouter);
container.bind<AuthRouter>(TYPES.AuthRouter).to(AuthRouter);

// Socket bindings
container.bind<SocketConfig>(TYPES.SocketConfig).to(SocketConfig);
container.bind<SocketHandlers>(TYPES.SocketHandlers).to(SocketHandlers);
container.bind<UserSocket>(TYPES.UserSocket).to(UserSocket);

// Config bindings
container.bind<MongoDBConfig>(TYPES.MongoDBConfig).to(MongoDBConfig);
container.bind<RedisClient>(TYPES.RedisClient).to(RedisClient);

// Export the container
export { container };
