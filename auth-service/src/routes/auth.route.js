import express from "express";
import {
  registerUser,
  loginUser,
  refreshTokenUser,
  logoutUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Routes for authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshTokenUser);
router.post("/logout", logoutUser);

export { router };
