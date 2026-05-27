// import fs from "fs";
import fs from "fs";
import path from "path";
import { DeepgramClient } from "@deepgram/sdk";
import { getUploadedAudio } from "../utils/uploads.js";
import Transcription from "../models/transcriptionModel.js";

const deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY });

export const transcribeAudio = async (request, response) => {
  try {
    //if there is no data with request
    if (!request.body) {
      return response.status(400).json({
        success: false,
        message: "Please provide the required data to create a post",
      });
    }
    const file = request.file;

    if (!file) {
      return response.status(400).json({
        success: false,
        message: "No audio file uploaded",
      });
    }
    const { id } = request.user;
    if (!id) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in token",
      });
    }
    const uploadedAudio = await getUploadedAudio(file);

    const fullUrl = `${process.env.BASEURL}${uploadedAudio.name}`;

    const audioStream = fs.createReadStream(uploadedAudio.path);

    const data = await deepgram.listen.v1.media.transcribeFile(audioStream, {
      model: "nova-3",
      language: "en",
    });

    // console.log("Deepgram API response:", data);
    const transcriptionText =
      data.results.channels[0].alternatives[0].transcript || "";

    //save transcription to database
    const savedTranscription = await Transcription.create({
      filename: uploadedAudio.name,
      audioUrl: fullUrl,
      transcriptionText: transcriptionText,
      userId: id,
      status: "completed",
    });
    //remove the uploaded audio file after transcription
    await fs.unlinkSync(uploadedAudio.path);
    // console.log("Transcription saved to database:", savedTranscription);
    return response.status(201).json({
      success: true,
      message: "Audio transcribed successfully",
      data: savedTranscription,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      message: "Error occurred while transcribing audio",
    });
  }
};
