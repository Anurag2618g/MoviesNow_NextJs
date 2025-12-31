import { connectDB } from "../db/mongo";
import User from "./user.model";

export const getAllUsers = async() => {
    await connectDB();

    const users = await User.find().select("-passwordhash");

    return users.map(user => ({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        lastLoggedIn: user.lastLoggedIn,
    }));
};

export const getCurrentUser = async(userId: string) => {
    await connectDB();
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
        throw new Error("user not found");
    }
    return {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        lastLoggedIn: user.lastLoggedIn,
    };
};

export const getUser = async(userId: string) => {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};