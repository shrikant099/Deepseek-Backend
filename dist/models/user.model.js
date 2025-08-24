import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
var Provider;
(function (Provider) {
    Provider["GOOGLE"] = "google";
    Provider["CREDENTIALS"] = "credentials";
})(Provider || (Provider = {}));
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: function () {
            return this.provider === Provider.CREDENTIALS;
        },
        minlength: [6, "Password must be at least 6 characters long"],
        select: false, // Do not return password by default
    },
    profilePicture: {
        type: String,
    },
    provider: {
        type: String,
        enum: Object.values(Provider),
        default: Provider.CREDENTIALS,
        required: true,
    },
    providerId: {
        type: String,
        required: function () {
            return this.provider !== Provider.CREDENTIALS;
        },
        unique: true,
        trim: true,
        index: true
    },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) {
        return next();
    }
    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password)
        return false;
    return await bcryptjs.compare(candidatePassword, this.password);
};
export const User = mongoose.model("User", userSchema);
