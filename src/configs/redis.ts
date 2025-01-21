import { injectable } from "inversify";
import { Redis } from "ioredis";
import { configs } from "./configuration";

@injectable()
export class RedisClient {
    private client: Redis;

    constructor() {
        this.client = new Redis({
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

        console.log("[Redis]: Redis is initialized");
    }

    public getClient(): Redis {
        return this.client;
    }
}

export default RedisClient;
