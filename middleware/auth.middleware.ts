import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTUserPayload } from "../controllers/auth.controllers.js";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.authToken;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized, please login again",
        });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JWTUserPayload;
        req.user = decodedToken;
        next();
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Unauthorized, please login again",
        });
    }
}

export default isAuthenticated;