import { Schema, model } from "mongoose";
import { ERole, EUserStatus, USER_COLLECTION } from "@/constants";
import { configSchema } from "@/configs";
import { IUserSchema } from "@/types";

const userSchema = new Schema<IUserSchema>(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: {
            type: Number,
            required: true,
            enum: Object.values(ERole).filter(
                (value) => typeof value === "number"
            ),
            default: ERole.USER,
        },
        status: {
            type: Number,
            required: true,
            enum: Object.values(EUserStatus).filter(
                (value) => typeof value === "number"
            ),
            default: EUserStatus.INACTIVE,
        },
    },
    configSchema
);

const UserModel = model<IUserSchema>(USER_COLLECTION, userSchema);

export default UserModel;
