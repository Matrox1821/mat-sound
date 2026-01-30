import { create } from "zustand";

interface UserState {
  avatar: string | null;
  updatedAt: Date | string | null;
  hydrated: boolean;
  hydrate: (data: { avatar: string | null; updatedAt: Date | string }) => void;
}

export const useUserAvatarStore = create<UserState>((set) => ({
  avatar: null,
  updatedAt: null,
  hydrated: false,
  hydrate: (data) => set({ avatar: data.avatar, updatedAt: data.updatedAt, hydrated: true }),
}));
