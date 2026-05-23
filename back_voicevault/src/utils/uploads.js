import path from "path";
import { promises as fs } from "fs";
import multer from "multer";

const normalizePath = (filePath) => filePath.replaceAll("\\", "/");

const allowedAudioMimeTypes = new Set([
  "audio/aac",
  "audio/flac",
  "audio/m4a",
  "audio/mp3",
  "audio/mp4",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "audio/x-m4a",
  "audio/x-wav",
]);

const allowedAudioExtensions = new Set([
  ".aac",
  ".flac",
  ".m4a",
  ".mp3",
  ".mp4",
  ".oga",
  ".ogg",
  ".wav",
  ".webm",
]);

const createUploadError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const imageFileFilter = (request, file, callback) => {
  if (!file.mimetype?.startsWith("image/")) {
    return callback(createUploadError("Only image files are allowed"), false);
  }

  callback(null, true);
};

const audioFileFilter = (request, file, callback) => {
  const mimetype = file.mimetype?.toLowerCase();
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedAudioMimeTypes.has(mimetype) && !allowedAudioExtensions.has(extension)) {
    return callback(createUploadError("Only audio files are allowed"), false);
  }

  callback(null, true);
};

const createFileName = (file) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const name =
    path
      .basename(file.originalname, extension)
      .trim()
      .replace(/[^a-z0-9_-]+/gi, "-")
      .replace(/^-+|-+$/g, "") || "upload";
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  return `${name}-${uniqueName}${extension}`;
};

const createUploader = (uploadPath, fieldName, fileFilter, options = {}) => {
  const storage = multer.diskStorage({
    destination: async (request, file, callback) => {
      try {
        await fs.mkdir(uploadPath, { recursive: true });
        callback(null, uploadPath);
      } catch (error) {
        callback(error);
      }
    },
    filename: (request, file, callback) => {
      callback(null, createFileName(file));
    },
  });

  const upload = multer({
    storage,
    fileFilter,
    limits: options.limits,
  });

  if (Array.isArray(fieldName)) {
    const fields = fieldName.map((name) => ({
      name,
      maxCount: options.maxCount || 1,
    }));

    return (request, response, next) => {
      upload.fields(fields)(request, response, (error) => {
        if (error) {
          return next(error);
        }

        request.file = Object.values(request.files || {})[0]?.[0];
        next();
      });
    };
  }

  return upload.single(fieldName);
};

const getUploadedFile = (file) => {
  if (!file) {
    return false;
  }

  return {
    path: normalizePath(file.path),
    name: file.filename,
  };
};

export const createImageUploader = (uploadPath, fieldName = "image", options = {}) =>
  createUploader(uploadPath, fieldName, imageFileFilter, options);

export const createAudioUploader = (uploadPath, fieldName = "audio", options = {}) =>
  createUploader(uploadPath, fieldName, audioFileFilter, {
    ...options,
    limits: {
      fileSize: 50 * 1024 * 1024,
      ...options.limits,
    },
  });

export const getUploadedImage = getUploadedFile;

export const getUploadedAudio = getUploadedFile;
