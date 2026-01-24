import { ImageSizes } from "@/types/common.types";
import { create } from "zustand";

export interface TrackData {
  id: string;
  cover: ImageSizes;
}

interface PlaylistDetails {
  id: string;
  name: string;
  cover: ImageSizes | null; // El cover propio de la playlist
  tracks: Map<string, TrackData>;
}

interface PlaylistState {
  playlists: Map<string, PlaylistDetails>;
  hydrated: boolean;

  hydrate: (
    playlistsData: {
      id: string;
      name: string;
      cover?: ImageSizes | null;
      tracks: TrackData[];
    }[],
  ) => void;

  toggleTrackInPlaylist: (playlistId: string, track: TrackData) => void;
  isTrackInPlaylist: (playlistId: string, trackId: string) => boolean;
  createPlaylist: (id: string, name: string) => void;
  removePlaylist: (playlistId: string) => void;

  getPlaylistDisplayImages: (playlistId: string) => ImageSizes[] | null;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: new Map(),
  hydrated: false,

  hydrate: (playlistsData) => {
    const next = new Map<string, PlaylistDetails>();
    playlistsData.forEach((p) => {
      next.set(p.id, {
        id: p.id,
        name: p.name,
        cover: p.cover ?? null,
        tracks: new Map(p.tracks.map((t) => [t.id, t])),
      });
    });
    set({ playlists: next, hydrated: true });
  },

  // ... (toggleTrackInPlaylist, isTrackInPlaylist, removePlaylist se mantienen igual)

  toggleTrackInPlaylist: (playlistId, track) =>
    set((state) => {
      const next = new Map(state.playlists);
      const playlist = next.get(playlistId);
      if (!playlist) return state;

      const updatedTracks = new Map(playlist.tracks);
      if (updatedTracks.has(track.id)) {
        updatedTracks.delete(track.id);
      } else {
        updatedTracks.set(track.id, track);
      }

      next.set(playlistId, { ...playlist, tracks: updatedTracks });
      return { playlists: next };
    }),

  isTrackInPlaylist: (playlistId, trackId) =>
    get().playlists.get(playlistId)?.tracks.has(trackId) ?? false,

  createPlaylist: (id, name) =>
    set((state) => {
      if (state.playlists.has(id)) return state;
      const next = new Map(state.playlists);
      next.set(id, { id, name, cover: null, tracks: new Map() });
      return { playlists: next };
    }),

  removePlaylist: (playlistId) =>
    set((state) => {
      const next = new Map(state.playlists);
      next.delete(playlistId);
      return { playlists: next };
    }),

  // --- LÓGICA DE PRIORIDAD DE IMAGEN ---
  getPlaylistDisplayImages: (playlistId) => {
    const playlist = get().playlists.get(playlistId);
    if (!playlist) return null;

    // prioridad absoluta: cover propio
    if (playlist.cover) {
      return [playlist.cover];
    }

    const images = Array.from(playlist.tracks.values())
      .slice(0, 4)
      .map((track) => track.cover)
      .filter((cover): cover is ImageSizes => cover !== null && cover !== undefined);

    return images.length > 0 ? images : null;
  },
}));
