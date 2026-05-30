# VoiceVault

VoiceVault is a full-stack voice transcription app. Users can register, log in, upload an audio file or record audio in the browser, and send it to the backend for English speech-to-text transcription with Deepgram. Transcriptions are saved in MongoDB and recent results are also shown in the frontend history.

## Project Structure

```text
VoiceVault/
  back_voicevault/    Express API, MongoDB models, auth, uploads, Deepgram transcription
  front_voicevault/   React + Vite frontend
```

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS, React Icons
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT stored in an HTTP-only cookie
- Uploads: Multer with audio MIME/extension checks
- Speech-to-text: Deepgram SDK

## Main Features

- User registration and login
- Protected dashboard route
- Audio upload with drag-and-drop support
- Browser microphone recording with `MediaRecorder`
- Deepgram transcription using the `nova-3` model and English language setting
- Transcription persistence in MongoDB
- Local browser history for recently returned transcriptions

## Prerequisites

- Node.js and npm
- MongoDB connection string
- Deepgram API key

## Environment Variables

Create a `.env` file in each app folder.

Backend: `back_voicevault/.env`

```env
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
DEEPGRAM_API_KEY=your_deepgram_api_key
BASEURL=http://localhost:5000/
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=2
PORT=5000
```

Frontend: `front_voicevault/.env`

```env
VITE_PUBLIC_API_URL=http://localhost:5000/voicevault
```

Notes:

- `JWT_EXPIRE` is currently treated as a number of hours when setting the cookie max age.
- `CLIENT_URL` should match the frontend URL so cookies work with CORS.
- In production, cookies use `secure: true` and `sameSite: "none"`, so HTTPS is required.

## Local Setup

Install backend dependencies:

```bash
cd back_voicevault
npm install
```

Install frontend dependencies:

```bash
cd front_voicevault
npm install
```

Start the backend:

```bash
cd back_voicevault
npm run dev
```

Start the frontend:

```bash
cd front_voicevault
npm run dev
```

Open the Vite URL, usually `http://localhost:5173`.

## App Flow

1. A visitor lands on the VoiceVault landing page.
2. The user registers or logs in.
3. The backend returns a JWT in an HTTP-only `token` cookie.
4. The frontend calls `/user/session` with credentials included to restore the session.
5. The authenticated user opens the action page.
6. The user uploads an audio file or records audio in the browser.
7. The frontend posts the audio as multipart form data to the backend.
8. The backend validates the JWT, stores the upload temporarily, sends the audio stream to Deepgram, saves the transcription, deletes the temporary file, and returns the saved transcription.

## API Summary

Base URL:

```text
http://localhost:5000/voicevault
```

| Method | Endpoint                 | Auth | Body                              | Purpose                           |
| ------ | ------------------------ | ---- | --------------------------------- | --------------------------------- |
| `POST` | `/user/register`         | No   | JSON: `name`, `email`, `password` | Create a user and set auth cookie |
| `POST` | `/user/login`            | No   | JSON: `email`, `password`         | Log in and set auth cookie        |
| `POST` | `/user/logout`           | Yes  | None                              | Clear auth cookie                 |
| `GET`  | `/user/session`          | Yes  | None                              | Return current user details       |
| `POST` | `/transcribe/transcribe` | Yes  | Multipart field `audio`           | Transcribe uploaded audio         |

Health check:

```text
GET http://localhost:5000/
```

## Useful Scripts

Backend:

```bash
npm run dev     # Start with nodemon
npm start       # Start with node
```

Frontend:

```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run lint    # Run ESLint
npm run preview # Preview production build
```

## Documentation

- Backend details: [back_voicevault/README.md](./back_voicevault/README.md)
- Frontend details: [front_voicevault/README.md](./front_voicevault/README.md)
