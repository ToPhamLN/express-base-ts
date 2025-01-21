import "tsconfig-paths/register";
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import App from "@/app";
import { MongoDBConfig, SocketConfig, RedisClient, container } from "@/configs";
import { TYPES } from "@/constants";
import { SocketHandlers } from "./socket";

async function bootstrap() {
    const app = await new App().initializeApp();
    const PORT = process.env.PORT || 8080;
    const server = http.createServer(app);

    container.get<SocketConfig>(TYPES.SocketConfig).init(server);
    container.get<MongoDBConfig>(TYPES.MongoDBConfig);
    container.get<RedisClient>(TYPES.RedisClient);
    container.get<SocketHandlers>(TYPES.SocketHandlers);

    server.listen(PORT, () => {
        console.log(
            `[Server]: Server is running on at http://localhost:${PORT}`
        );
    });
}

bootstrap();
