import express from "express";
import { loginUser, registerUser, forgotPassword, googleLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.post("/google-login", googleLogin);

export default router;
