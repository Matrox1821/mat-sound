import { create } from "zustand";

interface LikeState {
  likedTrackIds: Set<string>;
  hydrated: boolean;
  hydrate: (ids: string[]) => void;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
}

export const useLikeStore = create<LikeState>((set, get) => ({
  likedTrackIds: new Set(),
  hydrated: false,

  hydrate: (ids) =>
    set({
      likedTrackIds: new Set(ids),
      hydrated: true,
    }),

  toggleLike: (id) =>
    set((state) => {
      const next = new Set(state.likedTrackIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { likedTrackIds: next };
    }),

  isLiked: (id) => get().likedTrackIds.has(id),
}));
