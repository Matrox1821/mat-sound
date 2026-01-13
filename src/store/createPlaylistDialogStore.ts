import { create } from "zustand";

interface DialogState {
  trackId: string;
  isVisible: boolean;
  setTrackId: (trackId: string) => void;
  setIsVisible: (visible: boolean) => void;

  toggle: () => void;
}

export const useCreatePlaylistDialogStore = create<DialogState>((set) => ({
  trackId: "",
  isVisible: false,
  setTrackId: (trackId: string) => set({ trackId: trackId }),
  setIsVisible: (visible: boolean) => set({ isVisible: visible }),
  toggle: () => set((state) => ({ isVisible: !state.isVisible })),
}));
