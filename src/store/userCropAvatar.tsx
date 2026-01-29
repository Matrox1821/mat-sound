import { create } from "zustand";

interface DialogState {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;

  toggle: () => void;
}

export const useUserCropAvatarStore = create<DialogState>((set) => ({
  isVisible: false,
  setIsVisible: (visible: boolean) => set({ isVisible: visible }),
  toggle: () => set((state) => ({ isVisible: !state.isVisible })),
}));
