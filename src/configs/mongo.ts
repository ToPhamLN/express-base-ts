import mongoose from "mongoose";
import { configs } from "@/configs";
import { injectable } from "inversify";
import { USER_COLLECTION } from "@/constants";
import { userSchema } from "@/models";
import { Model } from "mongoose";

@injectable()
export class MongoDBConfig {
    private optionConfigs: mongoose.ConnectOptions = {};
    constructor() {
        this.connect();
    }

    public async connect() {
        try {
            await mongoose.connect(configs.mongodb, this.optionConfigs);
            console.log("[Data]: Connected to MongoDB");
        } catch (error) {
            console.error("[Data]: Error connecting to MongoDB");
            console.error((error as Error).message);
        }
    }

    public async disconnect() {
        await mongoose.disconnect();
        console.log("[Data]: Disconnected from MongoDB");
    }

    public userModel() {
        return mongoose.model(USER_COLLECTION, userSchema);
    }
}
