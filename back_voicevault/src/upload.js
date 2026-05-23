import path from "path";
import { fileURLToPath } from "url";
import { createAudioUploader, getUploadedAudio } from "./utils/uploads.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const audioUploadPath = path.resolve(__dirname, "../uploads/audio");

export const uploadAudio = createAudioUploader(audioUploadPath, "audio");

export { createAudioUploader, getUploadedAudio };
