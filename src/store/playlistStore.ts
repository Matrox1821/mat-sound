import { ImageSizes } from "@shared-types/common.types";
import { create } from "zustand";

export interface TrackData {
  id: string;
  cover: ImageSizes;
}

export interface PlaylistDetails {
  id: string;
  name: string;
  cover: ImageSizes | null;
  // 1. Cambiamos el Map por un Array
  tracks: TrackData[];
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
  isPlaylistInStore: (playlistId: string) => boolean;
  createPlaylist: (id: string, name: string) => void;
  removePlaylist: (playlistId: string) => void;
  getPlaylistDisplayImages: (playlistId: string) => ImageSizes[] | null;
  // Función extra preparada para Drag & Drop
  reorderTracks: (playlistId: string, startIndex: number, endIndex: number) => void;
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
        // 2. Simplemente guardamos el array
        tracks: [...p.tracks],
      });
    });
    set({ playlists: next, hydrated: true });
  },

  toggleTrackInPlaylist: (playlistId, track) =>
    set((state) => {
      const next = new Map(state.playlists);
      const playlist = next.get(playlistId);
      if (!playlist) return state;

      // 3. Usamos findIndex para saber si la pista ya está en el array
      const trackIndex = playlist.tracks.findIndex((t) => t.id === track.id);
      let updatedTracks: TrackData[];

      if (trackIndex !== -1) {
        // Si existe, la eliminamos filtrando el array
        updatedTracks = playlist.tracks.filter((t) => t.id !== track.id);
      } else {
        // Si no existe, la añadimos al final del array
        updatedTracks = [...playlist.tracks, track];
      }

      next.set(playlistId, { ...playlist, tracks: updatedTracks });
      return { playlists: next };
    }),

  isTrackInPlaylist: (playlistId, trackId) => {
    const playlist = get().playlists.get(playlistId);
    if (!playlist) return false;
    // 4. Usamos .some() que es la forma más rápida de verificar si algo existe en un array
    return playlist.tracks.some((t) => t.id === trackId);
  },

  isPlaylistInStore: (playlistId) => get().playlists.has(playlistId),

  createPlaylist: (id, name) =>
    set((state) => {
      if (state.playlists.has(id)) return state;
      const next = new Map(state.playlists);
      // 5. Inicializamos tracks como un array vacío
      next.set(id, { id, name, cover: null, tracks: [] });
      return { playlists: next };
    }),

  removePlaylist: (playlistId) =>
    set((state) => {
      const next = new Map(state.playlists);
      next.delete(playlistId);
      return { playlists: next };
    }),

  getPlaylistDisplayImages: (playlistId) => {
    const playlist = get().playlists.get(playlistId);
    if (!playlist) return null;

    if (playlist.cover) {
      return [playlist.cover];
    }

    // 6. Al ser un array, podemos hacer un slice directo en lugar de usar Array.from()
    const images = playlist.tracks
      .slice(0, 4)
      .map((track) => track.cover)
      .filter((cover): cover is ImageSizes => cover !== null && cover !== undefined);

    return images.length > 0 ? images : null;
  },

  // 7. BONUS: Reordenar canciones (perfecto para integraciones con librerías como dnd-kit o react-beautiful-dnd)
  reorderTracks: (playlistId, startIndex, endIndex) =>
    set((state) => {
      const next = new Map(state.playlists);
      const playlist = next.get(playlistId);
      if (!playlist) return state;

      const updatedTracks = Array.from(playlist.tracks);
      const [removed] = updatedTracks.splice(startIndex, 1);
      updatedTracks.splice(endIndex, 0, removed);

      next.set(playlistId, { ...playlist, tracks: updatedTracks });
      return { playlists: next };
    }),
}));
