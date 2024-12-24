import { CreateUserDto } from "@/dtos";
import { UserModel } from "@/models";
import { injectable } from "inversify";

@injectable()
export class UserRepository {
    constructor() {}

    public async createUser(user: CreateUserDto) {
        const res = await new UserModel(user).save();
        return res;
    }

    public async findUserByEmailAndPassword(email: string, password: string) {
        const res = await UserModel.findOne({ email, password });
        return res;
    }

    public async findExistedEmail(email?: string) {
        const res = await UserModel.findOne({ email });
        return res;
    }

    public async findUserById(id: string) {
        const res = await UserModel.findById(id);
        return res;
    }
}
