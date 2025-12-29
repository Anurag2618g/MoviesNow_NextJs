import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        refreshTokenHash: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        }
    },
    {timestamps: true}
);

const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;