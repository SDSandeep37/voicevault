import { useRef, useState } from "react";
import { FaMicrophoneAlt } from "react-icons/fa";

const TRANSCRIPTION_HISTORY_KEY = "voicevault_transcription_history";

const getSavedTranscriptionHistory = () => {
  try {
    const savedHistory = localStorage.getItem(TRANSCRIPTION_HISTORY_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch (error) {
    console.error("Error reading transcription history:", error);
    return [];
  }
};

const formatHistoryDate = (date) => {
  if (!date) return "Unknown date";

  return new Date(date).toLocaleString();
};

const ActionPage = () => {
  const [recording, setRecording] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("No Transcription Yet");
  const [uploading, setUploading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [transcriptionText, setTranscriptionText] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(getSavedTranscriptionHistory);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

  const saveTranscriptionToHistory = (transcription) => {
    const historyItem = {
      id: transcription._id,
      transcriptionText: transcription.transcriptionText,
      createdAt: transcription.createdAt,
    };

    setHistory((currentHistory) => {
      const updatedHistory = [
        historyItem,
        ...currentHistory.filter((item) => item.id !== historyItem.id),
      ];

      localStorage.setItem(
        TRANSCRIPTION_HISTORY_KEY,
        JSON.stringify(updatedHistory),
      );

      return updatedHistory;
    });
  };

  const uploadAudioFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setStatus("Please upload an audio file");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    try {
      setUploading(true);
      setStatus(`Uploading: ${file.name}`);

      const response = await fetch(
        "http://localhost:5000/voicevault/transcribe/transcribe",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Upload failed");
      }

      setApiMessage(result.message);
      setTranscriptionText(result.data.transcriptionText);
      saveTranscriptionToHistory(result.data);
      setStatus(`Completed: ${result.data.filename}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      setApiMessage("");
      setTranscriptionText("");
      setStatus("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    uploadAudioFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    uploadAudioFile(e.dataTransfer.files[0]);
  };

  const stopMediaStream = () => {
    if (!mediaStreamRef.current) return;

    mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("Audio recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        const recordedFile = new File(
          [audioBlob],
          `recording-${Date.now()}.webm`,
          {
            type: audioBlob.type,
          },
        );

        stopMediaStream();
        setRecording(false);

        const shouldTranscribe = window.confirm(
          "Do you want to send this recording for transcription?",
        );

        if (shouldTranscribe) {
          uploadAudioFile(recordedFile);
        } else {
          setStatus("Recording saved locally but not sent.");
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setStatus("Recording Started");
    } catch (error) {
      console.error("Error starting recording:", error);
      stopMediaStream();
      setRecording(false);
      setStatus("Microphone permission denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setStatus("Recording Stopped");
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
      return;
    }

    startRecording();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-blue-900 text-white flex flex-col items-center py-12">
      {/* Header */}
      <h1 className="text-center text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-orange-500">
        Upload or Record Your Audio
      </h1>
      <p className="mt-2 text-gray-400 text-center max-w-xl">
        Choose how you'd like to transcribe your voice.
      </p>

      {/* Interaction Cards */}
      <div className="mt-12 flex flex-col md:flex-row gap-10">
        {/* Upload Section */}
        <div className="bg-gray-800/60 rounded-xl p-8 w-80 shadow-lg border border-gray-700 hover:border-blue-500 transition">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">
            Upload Audio File
          </h2>
          <label
            htmlFor="audio-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition ${
              dragging
                ? "border-blue-400 bg-blue-500/10"
                : "border-gray-600 hover:border-blue-400"
            }`}
          >
            <span className="text-gray-400">
              {uploading
                ? "Uploading..."
                : dragging
                  ? "Drop Audio File Here"
                  : "Drag & Drop Files Here"}
            </span>
            <span className="text-gray-500 mt-2">or</span>
            <span className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
              {uploading ? "Please Wait..." : "Browse Files"}
            </span>
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          <p className="mt-4 text-sm text-gray-400">Supports MP3, WAV, M4A</p>
        </div>

        {/* Record Section */}
        <div className="bg-gray-800/60 rounded-xl p-8 w-80 shadow-lg border border-gray-700 hover:border-orange-500 transition flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-orange-400">
            Record Your Voice
          </h2>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div
              className={`absolute w-full h-full rounded-full ${
                recording ? "bg-red-600 animate-pulse" : "bg-gray-700"
              }`}
            ></div>
            <button
              onClick={toggleRecording}
              className="relative z-10 text-white text-2xl"
            >
              <FaMicrophoneAlt />
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            {recording ? "Recording..." : "Ready to Record"}
          </p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-12 w-full max-w-3xl flex justify-between items-center bg-gray-900/70 px-6 py-4 rounded-lg border border-gray-700">
        <p className="text-gray-300">
          <span className="font-semibold text-white">
            Transcription Status:
          </span>{" "}
          {status}
        </p>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-orange-500 hover:text-orange-400 flex items-center gap-2 cursor-pointer"
        >
          ⏱ View History
        </button>
      </div>

      {apiMessage && (
        <div className="mt-6 w-full max-w-3xl bg-gray-900/70 px-6 py-5 rounded-lg border border-gray-700">
          <p className="text-green-400 font-semibold">{apiMessage}</p>
          <p className="mt-3 text-gray-300">
            <span className="font-semibold text-white">Transcription:</span>{" "}
            {transcriptionText}
          </p>
        </div>
      )}

      {showHistory && (
        <div className="mt-6 w-full max-w-3xl bg-gray-900/70 px-6 py-5 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">
              Transcription History
            </h2>
            <span className="text-sm text-gray-400">
              {history.length} {history.length === 1 ? "item" : "items"}
            </span>
          </div>

          {history.length === 0 ? (
            <p className="mt-3 text-gray-400">No history yet.</p>
          ) : (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-700 bg-gray-800/70 p-4 shadow-lg transition hover:border-orange-500"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-orange-400">
                      Transcription
                    </h3>
                    <span className="shrink-0 rounded bg-gray-900 px-2 py-1 text-xs text-gray-400">
                      {formatHistoryDate(item.createdAt)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-300">
                    {item.transcriptionText}
                  </p>
                  <p className="mt-4 break-all border-t border-gray-700 pt-3 text-xs text-gray-500">
                    ID: {item.id}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionPage;
