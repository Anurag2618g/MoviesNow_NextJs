import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '@/server/users/user.model';
import { connectDB } from '@/server/db/mongo';
import { env } from '../config/env';

export const registerUser = async(email: string, password: string) => {
    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({email, passwordHash});

    return {id: user._id, email: user.email};
};

export const loginUser = async(email: string, password: string) => {
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) throw new Error("Invalid credentials");

    const authenticated = await bcrypt.compare(password, user.passwordHash);
    if (!authenticated) throw new Error("Invalid credentials");

    user.lastLoggedIn = new Date();
    await user.save();

    const token = jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role
        },
        env.JWT_SECRET,
        { expiresIn: "20m" }
    );

    return { token };
};