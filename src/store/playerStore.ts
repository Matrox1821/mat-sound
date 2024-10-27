import { create } from "zustand";
import type { albumProps, trackProps } from "../types";

interface CurrentMusic {
  type?: null | albumProps;
  track: null | trackProps;
  tracks?: trackProps[];
}
interface PlayerState {
  isPlaying: boolean;
  currentMusic: CurrentMusic;
  isActive: boolean;
  playerScreenIsOpen: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentMusic: (currentMusic: CurrentMusic) => void;
  setIsActive: (isActive: boolean) => void;
  setPlayerScreenIsOpen: (playerScreenIsOpen: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentMusic: { type: null, track: null, tracks: [] },
  isActive: false,
  playerScreenIsOpen: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentMusic: (currentMusic) => set({ currentMusic }),
  setIsActive: (isActive) => set({ isActive }),
  setPlayerScreenIsOpen: (playerScreenIsOpen) => set({ playerScreenIsOpen }),
}));
