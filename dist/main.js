import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { router } from "./routes/auth.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// Importing Routes
app.use("/api", router);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use((error, req, res, next) => {
    console.error(`Error: ${error.stack}`);
    res.status(error.status || 500).json({
        error: error.message || "Something Went Wrong",
    });
});
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port http://localhost:${PORT}`);
});
