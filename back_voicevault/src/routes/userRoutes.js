import express from "express";
import {
  login,
  logout,
  register,
  userSession,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewars/authMiddleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
// protected routes
router.post("/logout", verifyToken, logout);
router.get("/session", verifyToken, userSession);
export default router;
