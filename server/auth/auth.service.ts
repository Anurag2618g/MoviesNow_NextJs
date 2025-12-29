import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '@/server/users/user.model';
import { connectDB } from '@/server/db/mongo';
import { env } from '../config/env';
import Session from './session.model';

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

    const accessToken = jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role
        },
        env.JWT_SECRET,
        { expiresIn: "5m" }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await Session.create({
        userId: user._id,
        refreshTokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now()+1000 * 60 * 60 * 24 * 7),
    })

    return { accessToken, refreshToken };
};