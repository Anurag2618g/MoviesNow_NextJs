import bcrypt from 'bcryptjs';
import User from '@/server/users/user.model';
import { connectDB } from '../db/mongo';

export const registerUser = async(email: string, password: string) => {
    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const passwordHash = bcrypt.hash(password, 10);
    const user = await User.create({email, passwordHash});

    return {id: user._id, email: user.email};
};