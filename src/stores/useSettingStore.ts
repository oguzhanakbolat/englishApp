import { CameraView } from "expo-camera";
import { createRef, RefObject } from "react";
import { create } from "zustand";

export interface StoredImage {
  uri: string;
  width?: number;
  height?: number;
  base64?: string | null;
  format?: string;
}

interface SettingStore {
  isOpenCamera: boolean;
  setIsOpenCamera: (isOpenCamera: boolean) => void;
  cameraRef: RefObject<CameraView | null>;
  image: StoredImage | null;
  setImage: (image: StoredImage | null) => void;
  clearImage: () => void;
}

export const useSettingStore = create<SettingStore>((set) => ({
  isOpenCamera: false,
  setIsOpenCamera: (isOpenCamera: boolean) => set({ isOpenCamera }),
  cameraRef: createRef<CameraView>(),
  image: null,
  setImage: (image: StoredImage | null) => set({ image }),
  clearImage: () => set({ image: null }),
}));
