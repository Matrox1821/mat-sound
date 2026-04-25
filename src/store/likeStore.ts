import { playerTrackProps } from "@/types/track.types";
import { create } from "zustand";

interface LikeState {
  likedTracks: playerTrackProps[]; // Única fuente de verdad
  hydrated: boolean;
  hydrate: (tracks: playerTrackProps[]) => void;
  toggleLike: (trackOrId: playerTrackProps) => void;
}

export const useLikeStore = create<LikeState>((set) => ({
  likedTracks: [],
  hydrated: false,

  hydrate: (tracks) => set({ likedTracks: tracks, hydrated: true }),

  toggleLike: (payload) =>
    set((state) => {
      const id = payload.id;
      const isLiked = state.likedTracks.some((t) => t.id === id);

      if (isLiked) {
        return { likedTracks: state.likedTracks.filter((t) => t.id !== id) };
      } else {
        return { likedTracks: [...state.likedTracks, payload] };
      }
    }),
}));

// SELECTOR: Esto es lo que usaría tu botón para ser ultra rápido
export const useIsLiked = (trackId: string) =>
  useLikeStore((state) => state.likedTracks.some((t) => t.id === trackId));
