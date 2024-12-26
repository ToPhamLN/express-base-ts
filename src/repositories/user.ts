import { MongoDBConfig } from "@/configs";
import { TYPES } from "@/constants";
import { CreateUserDto } from "@/dtos";
import { IUserSchema } from "@/types";
import { inject, injectable } from "inversify";
import { Model } from "mongoose";

@injectable()
export class UserRepository {
    private _userModel: Model<IUserSchema>;
    constructor(
        @inject(TYPES.MongoDBConfig)
        private readonly _mongoDBConfig: MongoDBConfig
    ) {
        this._userModel = this._mongoDBConfig.userModel();
    }

    public async createUser(user: CreateUserDto) {
        const res = await new this._userModel(user).save();
        return res;
    }

    public async findUserByEmailAndPassword(email: string, password: string) {
        const res = await this._userModel.findOne({ email, password });
        return res;
    }

    public async findExistedEmail(email?: string) {
        const res = await this._userModel.findOne({ email });
        return res;
    }

    public async findUserById(id: string) {
        const res = await this._userModel.findById(id);
        return res;
    }
}
