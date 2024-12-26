import { injectable } from "inversify";

@injectable()
export class AppContextService {
    private userOnline: Map<string, Set<string>> = new Map();
    private refreshToken: Map<string, Set<string>> = new Map();

    constructor() {}

    public setUserOnline(userId: string, token: string): void {
        if (!this.userOnline.has(userId)) {
            this.userOnline.set(userId, new Set());
        }
        this.userOnline.get(userId)?.add(token);
    }

    public getUserOnline(userId: string): Set<string> | undefined {
        return this.userOnline.get(userId);
    }

    public removeUserOnline(token: string): void {
        for (const [userId, tokens] of this.userOnline.entries()) {
            if (tokens.has(token)) {
                tokens.delete(token);
                if (tokens.size === 0) {
                    this.userOnline.delete(userId);
                }
                break;
            }
        }
    }

    public getUsersOnline(): string[] {
        return Array.from(this.userOnline.keys());
    }

    public setRefreshToken(userId: string, token: string): void {
        if (!this.refreshToken.has(userId)) {
            this.refreshToken.set(userId, new Set());
        }
        this.refreshToken.get(userId)?.add(token);
    }

    public getRefreshToken(userId: string): Set<string> | undefined {
        return this.refreshToken.get(userId);
    }
    public isTokenInRefreshToken(userId: string, token: string): boolean {
        return this.refreshToken.get(userId)?.has(token) ?? false;
    }
}

// import { injectable } from "inversify";
// import { Redis } from "ioredis";

// @injectable()
// export class AppContextService {
//     private redis: Redis;

//     constructor() {
//         // Khởi tạo kết nối Redis
//         this.redis = new Redis();
//     }

//     public async setUserOnline(userId: string, token: string): Promise<void> {
//         const key = `userOnline:${userId}`;
//         // Redis Set để lưu trữ các token của user
//         await this.redis.sadd(key, token);
//     }

//     public async getUserOnline(userId: string): Promise<Set<string> | null> {
//         const key = `userOnline:${userId}`;
//         // Lấy tất cả các token liên quan đến userId từ Redis
//         const tokens = await this.redis.smembers(key);
//         return new Set(tokens);
//     }

//     public async setRefreshToken(userId: string, token: string): Promise<void> {
//         const key = `refreshToken:${userId}`;
//         // Redis Set để lưu trữ refresh token
//         await this.redis.sadd(key, token);
//     }

//     public async getRefreshToken(userId: string): Promise<Set<string> | null> {
//         const key = `refreshToken:${userId}`;
//         // Lấy tất cả refresh token từ Redis
//         const tokens = await this.redis.smembers(key);
//         return new Set(tokens);
//     }

//     public async isTokenInRefreshToken(
//         userId: string,
//         token: string
//     ): Promise<boolean> {
//         const key = `refreshToken:${userId}`;
//         // Kiểm tra xem token có tồn tại trong Redis Set hay không
//         const exists = await this.redis.sismember(key, token);
//         return exists === 1; // Redis trả về 1 nếu có, 0 nếu không có
//     }
// }
