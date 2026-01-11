import { create } from "zustand";

interface AsideState {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  toggle: () => void;
}

export const useAsideStore = create<AsideState>((set) => ({
  isExpanded: true,
  setIsExpanded: (expanded: boolean) => set({ isExpanded: expanded }),
  toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
}));

