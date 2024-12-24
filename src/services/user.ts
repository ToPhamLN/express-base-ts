import { configs, redis, sendEmail } from "@/configs";
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
import jwt from "jsonwebtoken";

@injectable()
export class UserService {
    private refreshTokens = [];

    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository
    ) {}

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
            await this.userRepository.findExistedEmail(emailEncoded);
        if (existedEmail) throw Exception.badRequest("Email already exists");

        const userCreated = await this.userRepository.createUser(user);

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
        const otpRedis = await redis.get(VERIFY_EMAIL(_id));
        if (otpRedis !== otp) throw Exception.badRequest("OTP is not correct");
        await redis.del(VERIFY_EMAIL(_id));

        const user = (await this.userRepository.findUserById(
            _id
        )) as IUserSchema;
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

        const userFound =
            await this.userRepository.findExistedEmail(emailEncoded);
        if (!userFound) throw Exception.badRequest("User not found");

        const isPasswordCorrect = comparePassword(
            passwordEncoded,
            userFound.password
        );
        if (!isPasswordCorrect)
            throw Exception.badRequest("Password is not correct");

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
        const user = (await this.userRepository.findUserById(
            decoded.userId
        )) as IUserSchema;
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
        await redis.del(VERIFY_EMAIL(decoded.userId));
        return;
    }

    public async saveOTP(_id: string) {
        const otp = generateOTP();
        await redis.setex(VERIFY_EMAIL(_id), 300, otp);
        return otp;
    }

    public async sendEmail(_id: string, email: string) {
        try {
            const otp = await this.saveOTP(_id);
            console.log("OTP:", otp);
            await sendEmail(MAIL_VERIFY_OTP(email, otp));
        } catch (error) {
            console.error("Error sending email:", (error as Error).message);
        }
    }
}
