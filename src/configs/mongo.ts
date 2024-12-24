import mongoose from "mongoose";
import { configs } from "@/configs";

const optionConfigs = {};

export const connectMongo = async () => {
    try {
        await mongoose.connect(configs.mongodb, optionConfigs);
        console.log("[Data]: Connected to MongoDB");
    } catch (error) {
        console.error("[Data]: Error connecting to MongoDB");
        console.error((error as Error).message);
    }
};
