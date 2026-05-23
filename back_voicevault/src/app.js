import express from "express";
import cors from "cors";

import path from "path";

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// here "/uploads" means sever any thing start with this and "uploads" means the folder name

// Health route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

// Import Routes
import transcribeRoutes from "./routes/transcribeRoutes.js";
// Use Routes
app.use("/voicevault/transcribe", transcribeRoutes);

//global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
export default app;
