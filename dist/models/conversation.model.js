import mongoose from "mongoose";
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ASSISTENT"] = "assistant";
    Role["SYSTEM"] = "system";
})(Role || (Role = {}));
const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: Object.values(Role),
        required: [true, "Role is required"],
        index: true
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    comment: {
        type: String,
        required: [true, "Comment is required"],
    },
}, { _id: false, timestamps: true });
const conversationSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: [true, "Chat ID is required"],
        index: true
    },
    messages: {
        type: [messageSchema],
        default: [],
    },
}, { timestamps: true });
export const Conversation = mongoose.model("Conversation", conversationSchema);
