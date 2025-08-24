import mongoose, { Document, Types } from "mongoose";


interface IChat extends Document {
    userId: Types.ObjectId;
    message: string;
    title: string;
    description: string;
}

const chatSchema = new mongoose.Schema<IChat>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
