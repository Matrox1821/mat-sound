import { create } from "zustand";
import type { trackProps } from "../types";

interface CurrentMusic {
  track: null | trackProps;
  tracks?: trackProps[];
  nextTracks?: trackProps[];
  playlist?: trackProps[];
}
interface PlayerState {
  isPlaying: boolean;
  currentMusic: CurrentMusic;
  isActive: boolean;
  playerScreenIsOpen: boolean;
  inLoop: "none" | "all" | "one";
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentMusic: (currentMusic: CurrentMusic) => void;
  setIsActive: (isActive: boolean) => void;
  setPlayerScreenIsOpen: (playerScreenIsOpen: boolean) => void;
  setInLoop: (inLoop: "none" | "all" | "one") => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentMusic: { track: null, tracks: [], nextTracks: [], playlist: [] },
  isActive: false,
  playerScreenIsOpen: false,
  inLoop: "none",
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentMusic: (currentMusic) => set({ currentMusic }),
  setIsActive: (isActive) => set({ isActive }),
  setPlayerScreenIsOpen: (playerScreenIsOpen) => set({ playerScreenIsOpen }),
  setInLoop: (inLoop) => set({ inLoop }),
}));
