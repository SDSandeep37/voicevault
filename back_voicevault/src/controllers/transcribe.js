export const transcribeAudio = async (request, response) => {
  try {
    const file = request.file;

    if (!file) {
      return response.status(400).json({
        success: false,
        message: "No audio file uploaded",
      });
    }
    // Simulate transcription process
    const transcription = `Transcribed text for file: ${file.filename}`;
    response.json({
      success: true,
      transcription,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({
      success: false,
      message: "Error occurred while transcribing audio",
    });
  }
};
