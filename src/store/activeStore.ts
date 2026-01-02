import { create } from "zustand";

interface UIState {
  playerBarIsActive: boolean;
  playerRightMenuIsActive: boolean;
  playerScreenIsActive: boolean;
  setPlayerBarIsActive: (newPlayerBarState: boolean) => void;
  setPlayerRightMenuIsActive: (newPlayerRightMenuState: boolean) => void;
  activePlayerBar: () => void;

  setPlayerScreenIsActive: (newPlayerScreenState: boolean) => void;
}
const initialState = {
  playerBarIsActive: false,
  playerScreenIsActive: false,
  playerRightMenuIsActive: false,
};

export const useUIStore = create<UIState>((set, get) => ({
  ...initialState,
  setPlayerBarIsActive: (newPlayerBarState: boolean) =>
    set({ playerBarIsActive: newPlayerBarState }),
  activePlayerBar: () => set({ playerBarIsActive: true }),
  setPlayerScreenIsActive: (newPlayerScreenState: boolean) =>
    set({ playerScreenIsActive: newPlayerScreenState }),
  setPlayerRightMenuIsActive: (newPlayerRightMenuState: boolean) =>
    set({ playerRightMenuIsActive: newPlayerRightMenuState }),
}));
