# VoiceVault Frontend

This folder contains the React + Vite frontend for VoiceVault. It provides the landing page, authentication screens, protected action page, audio upload, browser recording, and transcription history UI.

## Folder Overview

```text
front_voicevault/
  index.html
  vite.config.js
  src/main.jsx
  src/App.jsx
  src/Contexts/AuthContext.jsx
  src/Pages/LandingPage/
  src/Pages/LoginPage/
  src/Pages/RegisterPage/
  src/Pages/ActionPage/
  public/icon.png
  public/banner.png
```

## Environment

Create `front_voicevault/.env`:

```env
VITE_PUBLIC_API_URL=http://localhost:5000/voicevault
```

The app appends endpoint paths such as `/user/login` and `/transcribe/transcribe` to this base URL.

## Run Locally

```bash
npm install
npm run dev
```

Vite usually serves the app at:

```text
http://localhost:5173
```

## Routes

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | `LandingPage` | Marketing/entry page with login, dashboard, upload, and record CTAs |
| `/register` | `RegisterPage` | User registration form |
| `/login` | `LoginPage` | User login form |
| `/action` | `ActionPage` | Protected upload/record/transcribe dashboard |

## Auth Flow

`UserAuthProvider` in `src/Contexts/AuthContext.jsx` owns:

- `user`
- `loading`
- `logout`
- `refreshUser`

On load, it calls:

```text
GET /user/session
```

with `credentials: "include"` so the browser sends the HTTP-only JWT cookie. The action page redirects unauthenticated users to `/login`.

## Audio Flow

The action page supports two audio sources:

- File upload through a hidden file input and drag-and-drop area.
- Browser recording through `navigator.mediaDevices.getUserMedia` and `MediaRecorder`.

Both flows call:

```text
POST /transcribe/transcribe
```

with multipart form data:

```text
audio=<file>
```

When the backend responds successfully, the page displays the transcription text and stores a compact history item in `localStorage` under:

```text
voicevault_transcription_history
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build production assets
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Backend Dependency

The frontend expects the backend to be running and reachable at `VITE_PUBLIC_API_URL`. For local development, also make sure the backend `CLIENT_URL` matches the Vite origin, usually:

```env
CLIENT_URL=http://localhost:5173
```
