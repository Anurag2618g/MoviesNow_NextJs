import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    lastLoggedIn: {
        type: Date,
    },
    },
    {
        timestamps: true
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;