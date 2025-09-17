import { create } from "zustand";

interface PlaybackState {
  isPlaying: boolean;
  inLoop: boolean;
  isShuffled: boolean;
  volume: number;
  togglePlay: () => void;
  setLoopMode: (inLoop: boolean) => void;
  toggleShuffle: () => void;
  setVolume: (volume: number) => void;
  play: () => void;
  pause: () => void;
}
const initialState = {
  isPlaying: false,
  inLoop: false,
  isShuffled: false,
  volume: 0.2,
};

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  ...initialState,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  play: () => set(() => ({ isPlaying: true })),
  pause: () => set(() => ({ isPlaying: false })),
  setVolume: (volume: number) => set({ volume }),
  setLoopMode: (inLoop) => set({ inLoop }),
  toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
}));
