import express from "express";
import { transcribeAudio } from "../controllers/transcribeController.js";
import { uploadAudio } from "../upload.js";
import { verifyToken } from "../middlewars/authMiddleware.js";
const router = express.Router();

router.post("/transcribe", verifyToken, uploadAudio, transcribeAudio);
export default router;
