import mongoose from "mongoose";
import { env } from "../config/env";

let isConnected = false;

export const connectDB = async() => {
    if (isConnected) return;
    try{
        await mongoose.connect(env.MONGO_URI);
        isConnected = true;
        console.log("Connected to MongoDB");
    }
    catch(error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);
    }
};


