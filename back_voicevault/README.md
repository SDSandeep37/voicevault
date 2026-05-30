# VoiceVault Backend

This folder contains the Express API for VoiceVault. It handles authentication, protected sessions, audio uploads, Deepgram transcription, and MongoDB persistence.

## Folder Overview

```text
back_voicevault/
  index.js                         Server entry point
  src/app.js                       Express app, middleware, route mounting
  src/config/db.js                 MongoDB connection
  src/config/env.js                dotenv setup
  src/controllers/userController.js
  src/controllers/transcribeController.js
  src/middlewars/authMiddleware.js JWT verification middleware
  src/models/userModel.js
  src/models/transcriptionModel.js
  src/routes/userRoutes.js
  src/routes/transcribeRoutes.js
  src/upload.js                    Audio upload middleware export
  src/utils/                       Passwords, cookies, validation, sanitization, uploads
```

## Environment

Create `back_voicevault/.env`:

```env
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
DEEPGRAM_API_KEY=your_deepgram_api_key
BASEURL=http://localhost:5000/
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=2
PORT=5000
```

## Run Locally

```bash
npm install
npm run dev
```

The API listens on `PORT` or `5000` by default.

## Middleware

- `cors` allows requests from `CLIENT_URL` and supports credentials.
- `express.json()` and `express.urlencoded()` parse request bodies.
- `cookie-parser` reads the JWT cookie.
- `/uploads` serves static files from the local `uploads` directory.
- `verifyToken` reads `token` from cookies first, then falls back to `Authorization: Bearer <token>`.

## Authentication

Registration and login create a JWT with:

```json
{
  "id": "user id",
  "email": "user email",
  "name": "user name"
}
```

The token is stored in an HTTP-only cookie named `token`.

Cookie behavior:

- Development: `sameSite: "lax"`, `secure: false`
- Production: `sameSite: "none"`, `secure: true`

## API Reference

### Health Check

```http
GET /
```

Success response:

```json
{
  "success": true,
  "message": "Backend is running"
}
```

### Register

```http
POST /voicevault/user/register
Content-Type: application/json
```

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password@123"
}
```

Behavior:

- Sanitizes name and email.
- Validates name, email, and password strength.
- Hashes the password with bcrypt.
- Creates a user.
- Sets the auth cookie.

Success response:

```json
{
  "success": true,
  "message": "User registration successful"
}
```

### Login

```http
POST /voicevault/user/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "jane@example.com",
  "password": "Password@123"
}
```

Success response:

```json
{
  "success": true,
  "message": "Login successful"
}
```

### Logout

```http
POST /voicevault/user/logout
Cookie: token=<jwt>
```

Success response:

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Current Session

```http
GET /voicevault/user/session
Cookie: token=<jwt>
```

Success response:

```json
{
  "user": {
    "id": "user id",
    "email": "jane@example.com",
    "name": "Jane Doe"
  }
}
```

### Transcribe Audio

```http
POST /voicevault/transcribe/transcribe
Cookie: token=<jwt>
Content-Type: multipart/form-data
```

Form field:

```text
audio=<audio file>
```

Supported extensions include:

```text
.aac, .flac, .m4a, .mp3, .mp4, .oga, .ogg, .wav, .webm
```

Behavior:

- Requires a valid JWT.
- Accepts one audio file in the `audio` field.
- Limits audio files to 50 MB.
- Sends the uploaded audio stream to Deepgram.
- Saves the transcription in MongoDB with status `completed`.
- Deletes the temporary uploaded audio file after transcription.

Success response:

```json
{
  "success": true,
  "message": "Audio transcribed successfully",
  "data": {
    "_id": "transcription id",
    "userId": "user id",
    "filename": "audio-file-name.webm",
    "audioUrl": "http://localhost:5000/uploads/audio/audio-file-name.webm",
    "transcriptionText": "Transcribed text",
    "language": "en",
    "status": "completed",
    "createdAt": "date"
  }
}
```

Note: the current controller deletes the uploaded file after transcription, so `audioUrl` is stored for metadata but the file will not remain available unless file retention is changed.

## Data Models

### User

```text
name: String, required
email: String, required, unique
password: String, required
createdAt: Date
timestamps: true
```

### Transcription

```text
userId: ObjectId -> User, required
filename: String, required
audioUrl: String, required
transcriptionText: String, required
language: String, default "en"
status: "pending" | "completed" | "failed"
createdAt: Date
timestamps: true
```

## Validation Rules

- Name: letters and spaces only, 2 to 30 characters.
- Email: normalized and validated with `validator`.
- Password: minimum 6 characters with lowercase, uppercase, number, and symbol.
- Audio upload: MIME type or extension must match the allowed audio list.
