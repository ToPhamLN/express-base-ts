import "tsconfig-paths/register";
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "@/app";
import { connectMongo, initSocket, redis } from "@/configs";
import connectWebSocket from "@/socket";

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
initSocket(server);
(async () => {
    try {
        console.log("[Redis]: Connected to Redis server");
        const keys = await redis.keys("verify_email_*");
        for await (const key of keys) {
            const value = await redis.get(key);
            console.log(`[Redis]: ${key}: ${value}`);
        }
    } catch (error) {
        console.error("[Redis]: Error connecting to Redis:", error);
    }
})();
connectWebSocket();
connectMongo();

server.listen(PORT, () => {
    console.log(`[Server]: Server is running on at http://localhost:${PORT}`);
});
