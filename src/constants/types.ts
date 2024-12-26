export const TYPES = {
    SocketConfig: Symbol.for("SocketConfig"),
    MongoDBConfig: Symbol.for("MongoDBConfig"),
    RedisClient: Symbol.for("RedisClient"),
    // ---------------------------------
    SocketHandlers: Symbol.for("SocketHandlers"),
    UserSocket: Symbol.for("UserSocket"),
    // ---------------------------------
    AuthMiddleware: Symbol.for("AuthMiddleware"),
    ValidationMiddleware: Symbol.for("ValidationMiddleware"),
    // ---------------------------------
    UserRouter: Symbol.for("UserRouter"),
    AuthRouter: Symbol.for("AuthRouter"),
    // ---------------------------------
    UserController: Symbol.for("UserController"),
    AuthController: Symbol.for("AuthController"),
    // ---------------------------------
    AuthService: Symbol.for("AuthService"),
    UserService: Symbol.for("UserService"),
    AppContextService: Symbol.for("AppContextService"),
    // ---------------------------------
    UserRepository: Symbol.for("UserRepository"),
};
