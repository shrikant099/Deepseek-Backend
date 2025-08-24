import jwt from "jsonwebtoken";
const isAuthenticated = (req, res, next) => {
    const token = req?.cookies?.authToken;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized, please login again",
        });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken); // yahan ye error aayegi agar decoded ek null-prototype object ho
        req.user = decodedToken;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Unauthorized, please login again",
        });
    }
};
export default isAuthenticated;
