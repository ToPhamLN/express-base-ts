import "tsconfig-paths/register";
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import App from "@/app";
import { MongoDBConfig, SocketConfig, RedisClient, container } from "@/configs";
import { TYPES } from "@/constants";

async function bootstrap() {
    const app = await new App().initializeApp();
    const PORT = process.env.PORT || 8080;
    const server = http.createServer(app);

    const socketConfig = container.get<SocketConfig>(TYPES.SocketConfig);
    container.get<SocketConfig>(TYPES.SocketConfig);
    container.get<MongoDBConfig>(TYPES.MongoDBConfig);
    container.get<RedisClient>(TYPES.RedisClient);

    socketConfig.init(server);

    server.listen(PORT, () => {
        console.log(
            `[Server]: Server is running on at http://localhost:${PORT}`
        );
    });
}

bootstrap();
