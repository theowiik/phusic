// Audio utility functions

// Try to play audio, but fail silently if file doesn't exist (for mocking)
export const tryPlayAudio = async (audioElement: HTMLAudioElement): Promise<void> => {
  try {
    await audioElement.play()
  } catch {
    // Silently handle missing audio files (mocking)
  }
}

// Calculate step time for audio fade
export const calculateStepTime = (duration: number, steps: number): number => {
  return duration / steps
}
