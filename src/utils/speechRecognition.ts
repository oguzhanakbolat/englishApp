import Constants from "expo-constants";

type SpeechModule = typeof import("expo-speech-recognition");

const isExpoGo =
  Constants.appOwnership === "expo" ||
  Constants.executionEnvironment === "storeClient";

let cached: SpeechModule | null | undefined;

export const getSpeechRecognition = (): SpeechModule | null => {
  if (isExpoGo) return null;
  if (cached !== undefined) return cached;

  try {
    cached = require("expo-speech-recognition") as SpeechModule;
  } catch {
    cached = null;
  }

  return cached;
};

export const hasSpeechRecognition = () => getSpeechRecognition() !== null;
