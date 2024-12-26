import { ERole, EUserStatus } from "@/constants";
import { Document } from "mongoose";

export interface IConfigSchema {
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserSchema extends Document, IConfigSchema {
    username: string;
    email: string;
    password: string;
    role: ERole;
    status: EUserStatus;
}
