import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  currentTime: number;
  duration: number;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  currentTime: 0,
  duration: 0,
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
}));
