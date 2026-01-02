import { create } from "zustand";

type LoopTypes = "once" | "all" | "none";

interface PlaybackState {
  isPlaying: boolean;
  loopMode: LoopTypes;
  isShuffled: boolean;
  volume: number;
  togglePlay: () => void;
  setLoopMode: (loopMode: LoopTypes) => void;
  toggleShuffle: () => void;
  setVolume: (volume: number) => void;
  play: () => void;
  pause: () => void;
}
const initialState = {
  isPlaying: false,
  loopMode: "none" as LoopTypes,
  isShuffled: false,
  volume: 0.2,
};

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  ...initialState,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  play: () => set(() => ({ isPlaying: true })),
  pause: () => set(() => ({ isPlaying: false })),
  setVolume: (volume: number) => set({ volume }),
  setLoopMode: (loopMode) => set({ loopMode }),
  toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
}));
