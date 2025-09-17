import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { contentProps } from "@/types";

interface PlayerState {
  currentTrack: contentProps | null;
  playlist: contentProps[];
  copiedPlaylist: contentProps[];
  currentIndex: number;
  setCurrentTrack: (track: contentProps) => void;
  setPlaylist: (playlist: contentProps[]) => void;
  setCopiedPlaylist: (playlist: contentProps[]) => void;
  setCurrentIndex: (index: number) => void;

  openPlayerScreen: () => void;
}

const initialState = {
  currentTrack: null,
  playlist: [],
  copiedPlaylist: [],
  currentIndex: 0,
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...initialState,
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setPlaylist: (playlist) => set({ playlist }),
  setCopiedPlaylist: (playlist) => set({ copiedPlaylist: playlist }),
  setCurrentIndex: (index) => set({ currentIndex: index }),

  openPlayerScreen: () => {
    // Implementation depends on your navigation setup
  },
}));
