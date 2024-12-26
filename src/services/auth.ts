import { configs, RedisClient, sendEmail } from "@/configs";
import { MAIL_VERIFY_OTP, TYPES, VERIFY_EMAIL } from "@/constants";
import { CreateUserDto, VerifyEmailDto } from "@/dtos";
import {
    comparePassword,
    Exception,
    generateOTP,
    generationAccessToken,
    generationRefreshToken,
    hashPassword,
} from "@/helpers";
import { UserRepository } from "@/repositories";
import { IUserSchema } from "@/types";
import { inject, injectable } from "inversify";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import { AppContextService } from "./app-context";

@injectable()
export class AuthService {
    redis: Redis;

    constructor(
        @inject(TYPES.UserRepository)
        private readonly _userRepo: UserRepository,
        @inject(TYPES.RedisClient)
        private readonly _redisClient: RedisClient,
        @inject(TYPES.AppContextService)
        private readonly _appContextService: AppContextService
    ) {
        this.redis = this._redisClient.getClient();
    }

    public async createUser(user: CreateUserDto) {
        const { username, email, password } = user;
        // const emailEncoded = encode(email);
        // const passwordEncoded = encode(password);
        const emailEncoded = email;
        const passwordEncoded = password;
        const hashedPassword = await hashPassword(passwordEncoded);
        user = {
            username,
            email: emailEncoded,
            password: hashedPassword,
        };

        const existedEmail =
            await this._userRepo.findExistedEmail(emailEncoded);
        if (existedEmail)
            throw Exception.badRequest("user:register.email_exist");

        const userCreated = await this._userRepo.createUser(user);

        await this.sendEmail(userCreated._id as string, emailEncoded);
        const accessToken = generationAccessToken(userCreated);
        const refreshToken = generationRefreshToken(userCreated);

        return {
            user: userCreated._id,
            accessToken,
            refreshToken,
        };
    }

    public async verifyOTP({ _id, otp }: VerifyEmailDto) {
        const otpRedis = await this.redis.get(VERIFY_EMAIL(_id));
        if (otpRedis !== otp)
            throw Exception.badRequest("user:verify_email.otp_incorrect");
        await this.redis.del(VERIFY_EMAIL(_id));

        const user = (await this._userRepo.findUserById(_id)) as IUserSchema;
        const accessToken = generationAccessToken(user);
        const refreshToken = generationRefreshToken(user);

        return {
            user: user._id,
            accessToken,
            refreshToken,
        };
    }

    public async login(user: CreateUserDto) {
        const { email, password } = user;
        const emailEncoded = email;
        const passwordEncoded = password;

        const userFound = await this._userRepo.findExistedEmail(emailEncoded);
        if (!userFound) throw Exception.badRequest("user:login.not_found");

        const isPasswordCorrect = comparePassword(
            passwordEncoded,
            userFound.password
        );
        if (!isPasswordCorrect)
            throw Exception.badRequest("user:login.password_incorrect");

        const accessToken = generationAccessToken(userFound);
        const refreshToken = generationRefreshToken(userFound);

        return {
            user: userFound._id,
            accessToken,
            refreshToken,
        };
    }

    public async refreshToken(refreshToken: string) {
        const decoded = jwt.verify(
            refreshToken,
            configs.jwt.refreshSecret
        ) as jwt.JwtPayload;
        if (!decoded) throw Exception.badRequest("user:refresh_token.invalid");
        const user = (await this._userRepo.findUserById(
            decoded.userId
        )) as IUserSchema;
        if (!user) throw Exception.badRequest("user:refresh_token.not_found");
        const accessToken = generationAccessToken(user);
        const newRefreshToken = generationRefreshToken(user);

        return {
            user: user._id,
            accessToken,
            refreshToken: newRefreshToken,
        };
    }

    public async logout(refreshToken: string) {
        const decoded = jwt.verify(
            refreshToken,
            configs.jwt.refreshSecret
        ) as jwt.JwtPayload;

        await this.redis.del(VERIFY_EMAIL(decoded.userId));
        return;
    }

    public async saveOTP(_id: string) {
        const otp = generateOTP();
        await this.redis.setex(VERIFY_EMAIL(_id), 300, otp);
        return otp;
    }

    public async sendEmail(_id: string, email: string) {
        try {
            const otp = await this.saveOTP(_id);
            await sendEmail(MAIL_VERIFY_OTP(email, otp));
        } catch (error) {
            console.error("Error sending email:", (error as Error).message);
        }
    }
}
