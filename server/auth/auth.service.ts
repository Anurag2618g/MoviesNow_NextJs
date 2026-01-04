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
            id: user._id.toString(),
            role: user.role
        },
        env.JWT_SECRET,
        { expiresIn: "5m" }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await createSession(refreshTokenHash, user._id);

    return { accessToken, refreshToken };
};

export const createSession = async(refreshTokenHash: string, id: string) => {
    await connectDB();

    await Session.create({
        userId: id,
        refreshTokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now()+1000 * 60 * 60 * 24 * 7),
    })
};

export const getSession = async(refreshTokenHash: string) => {
    await connectDB();

    const session = await Session.findOne({
        refreshTokenHash,
        expiresAt: { $gt: new Date() },
    });

    if (!session) {
        throw new Error("Invalid session");
    }
    return session;
};

export const deleteSessionByToken = async(refreshTokenHash: string) => {
    await connectDB();

    const res = await Session.deleteOne({ refreshTokenHash });
    if (!res) {
        throw new Error('Invalid token');
    }
    return 'Success';
};

export const deleteSessionById = async(id: string) => {
    await connectDB();

    const res = await Session.deleteOne({ _id: id });
    if (!res) {
        throw new Error('Invalid Id');
    }
    return 'Success';
};