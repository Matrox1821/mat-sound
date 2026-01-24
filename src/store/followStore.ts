import { create } from "zustand";

interface FollowState {
  artistFollowingIds: Set<string>;
  hydrated: boolean;
  hydrate: (ids: string[]) => void;
  toggleFollow: (id: string) => void;
  isFolloging: (id: string) => boolean;
}

export const useFollowStore = create<FollowState>((set, get) => ({
  artistFollowingIds: new Set(),
  hydrated: false,

  hydrate: (ids) =>
    set({
      artistFollowingIds: new Set(ids),
      hydrated: true,
    }),

  toggleFollow: (id) =>
    set((state) => {
      const next = new Set(state.artistFollowingIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { artistFollowingIds: next };
    }),

  isFolloging: (id) => get().artistFollowingIds.has(id),
}));
