import * as express from "express";
import { signIn, signUp, getCurrentUser, logout } from "../controllers/auth.controllers.js";
import isAuthenticated from "../middleware/auth.middleware.js";
const router = express.Router();

// Route for user registration
router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/current-user", isAuthenticated, getCurrentUser);
router.get("/logout", logout);

export { router };