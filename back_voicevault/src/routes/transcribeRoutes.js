import express from "express";
import { transcribeAudio } from "../controllers/transcribe.js";
import { uploadAudio } from "../upload.js";
const router = express.Router();

router.post("/transcribe", uploadAudio, transcribeAudio);
export default router;
