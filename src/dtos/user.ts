import { IsString, IsEmail, MinLength } from "class-validator";
import { Expose } from "class-transformer";
import { IsObjectId } from "@/helpers";

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @Expose()
    username: string;

    @IsEmail()
    @Expose()
    email: string;

    @IsString()
    @Expose()
    @MinLength(8)
    password: string;
}

export class VerifyEmailDto {
    @IsObjectId()
    @Expose()
    _id: string;

    @IsString()
    @Expose()
    otp: string;
}
