import { Redis } from "ioredis";
import { configs } from "./configuration";

export const redis = new Redis({
    port: Number(configs.redis.port),
    host: configs.redis.host as string,
    password: configs.redis.password as string,
    reconnectOnError: (error) => {
        console.error("Redis error:", error.message);
        return true;
    },
    retryStrategy: (times) => {
        console.log("Retry strategy called", times);
        return Math.min(times * 50, 2000);
    },
});
