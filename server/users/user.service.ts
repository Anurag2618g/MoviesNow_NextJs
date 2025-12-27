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