import mongoose, { Document, Types } from "mongoose";


enum Role {
    USER = "user",
    ASSISTENT = "assistant",
    SYSTEM = "system",
}

interface IMessage extends Document {
    role: Role;
    content: string;
    comment: string;

}

interface IConversation extends Document {
    chatId: Types.ObjectId;
    messages?: IMessage[];
}

const messageSchema = new mongoose.Schema<IMessage>(
    {

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
    },
    { _id: false, timestamps: true },
);


const conversationSchema = new mongoose.Schema<IConversation>({
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

export const Conversation = mongoose.model<IConversation>("Conversation", conversationSchema);  