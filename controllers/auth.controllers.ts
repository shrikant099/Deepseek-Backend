import type { Request, Response } from "express";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";


export interface JWTUserPayload extends jwt.JwtPayload {
    _id: Types.ObjectId | string,
    email: string,
}

// Function to handle user registration
export const signUp = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Please provide all required fields: name, email, and password",
                }
            )

        };

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });

        }

        // Create a new User;
        const newUser = await User.create({
            name,
            email,
            password,
            provider: "credentials",
        });

        const payload: JWTUserPayload = {
            _id: newUser._id as Types.ObjectId | string,
            email: newUser.email,
        }

        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: "10d"
        })

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "none"
        });

        return res.status(201).json({
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                provider: newUser.provider,
                profilePicture: newUser.profilePicture || ""
            },
            message: "User registered successfully",
        })

    } catch (error: any) {
        return res.status(500).json(
            {
                success: false,
                message: error.message || "Something went wrong during sign up",
            }
        )
    }
}
// Function to handle user Login
export const signIn = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { email, password } = req.body;
        console.log(`Email: ${email} password: ${password}`);
        if (!email || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Please provide all required fields:  email, and password",
                }
            )

        };

        // Check if user already exists
        const existingUser = await User.findOne({ email }).select("+password");
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials, user not found",
            });

        }

        // Check if password matches
        const isMatchPassword = await existingUser.comparePassword(password);
        if (!isMatchPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const payload: JWTUserPayload = {
            _id: existingUser._id as Types.ObjectId | string,
            email: existingUser.email,
        }

        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: "10d"
        })

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "none"
        });

        return res.status(200).json({
            success: true,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                provider: existingUser.provider,
                profilePicture: existingUser.profilePicture || ""
            },
            message: "User Login successfully",
        })

    } catch (error: any) {
        return res.status(500).json(
            {
                success: false,
                message: error.message || "Something went wrong during sign up",
            }
        )
    }
}

export const getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, please login again",
            });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                provider: user.provider,
                profilePicture: user.profilePicture || ""
            },
            message: "Current user retrieved successfully",
        });


    } catch (error: any) {
        return res.status(500).json(
            {
                success: false,
                message: error.message || "Something went wrong during get current user",
            }
        )
    }
}

// Function to handle user logout
export const logout = async (req: Request, res: Response): Promise<Response> => {
    try {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: false,
            sameSite: "none"
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });

    } catch (error: any) {
        return res.status(500).json(
            {
                success: false,
                message: error.message || "Something went wrong during logout",
            }
        )
    }
}