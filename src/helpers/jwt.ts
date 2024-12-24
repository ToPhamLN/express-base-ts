import { IUserSchema } from "@/types";
import { configs } from "@/configs";
import jwt from "jsonwebtoken";

export const generationAccessToken = ({ _id, role, status }: IUserSchema) => {
    return jwt.sign(
        {
            userId: _id,
            role,
            status,
        },
        configs.jwt.accessSecret,
        {
            expiresIn: configs.jwt.accessExpire,
        }
    );
};

export const generationRefreshToken = ({ _id, role, status }: IUserSchema) => {
    return jwt.sign(
        {
            userId: _id,
            role,
            status,
        },
        configs.jwt.refreshSecret,
        {
            expiresIn: configs.jwt.refreshExpire,
        }
    );
};
