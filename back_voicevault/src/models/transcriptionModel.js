import mongoose from "mongoose";

const transcriptionSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    transcriptionText: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: "en",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Transcription = mongoose.model("Transcription", transcriptionSchema);

export default Transcription;
