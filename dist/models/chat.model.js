import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
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
}, { timestamps: true });
export const Chat = mongoose.model("Chat", chatSchema);
