import { ImageSizes } from "@/types/common.types";
import { AlbumDetails, PlaylistDetails, TrackDetails } from "@/types/user.types";
import { create } from "zustand";

interface CollectionState {
  hydrated: boolean;
  tracks: Map<string, TrackDetails>;
  playlists: Map<string, PlaylistDetails>;
  albums: Map<string, AlbumDetails>;

  hydrate: (data: {
    tracks: Map<string, TrackDetails>;
    playlists: Map<string, PlaylistDetails>;
    albums: Map<string, AlbumDetails>;
  }) => void;

  toggleTrackInCollection: (track: TrackDetails) => void;
  togglePlaylistInCollection: (playlist: PlaylistDetails) => void;
  toggleAlbumInCollection: (album: AlbumDetails) => void;

  isTrackInCollection: (id: string) => boolean;
  isPlaylistInCollection: (id: string) => boolean;
  isAlbumInCollection: (id: string) => boolean;

  // Helpers adicionales
  getPlaylistDisplayImages: (playlistId: string) => ImageSizes[] | null;
}

// --- Store ---

export const useCollectionStore = create<CollectionState>((set, get) => ({
  hydrated: false,
  tracks: new Map(),
  playlists: new Map(),
  albums: new Map(),
  hydrate: ({ tracks, playlists, albums }) => {
    set({
      tracks,
      playlists,
      albums,
      hydrated: true,
    });
  },

  toggleTrackInCollection: (track) =>
    set((state) => {
      const next = new Map(state.tracks);
      if (next.has(track.id)) {
        next.delete(track.id);
      } else {
        next.set(track.id, track);
      }
      return { tracks: next };
    }),

  togglePlaylistInCollection: (playlist) =>
    set((state) => {
      const next = new Map(state.playlists);

      if (next.has(playlist.id)) {
        next.delete(playlist.id);
      } else {
        next.set(playlist.id, playlist);
      }
      return { playlists: next };
    }),

  toggleAlbumInCollection: (album) =>
    set((state) => {
      const next = new Map(state.albums);
      if (next.has(album.id)) {
        next.delete(album.id);
      } else {
        next.set(album.id, album);
      }
      return { albums: next };
    }),

  isTrackInCollection: (id) => get().tracks.has(id),
  isPlaylistInCollection: (id) => get().playlists.has(id),
  isAlbumInCollection: (id) => get().albums.has(id),

  getPlaylistDisplayImages: (playlistId) => {
    const playlist = get().playlists.get(playlistId);
    if (!playlist) return null;

    if (playlist.cover) {
      return [playlist.cover];
    }

    const trackImages = playlist.tracks
      .map((t) => t.cover)
      .filter((c): c is ImageSizes => !!c)
      .slice(0, 4);

    return trackImages.length > 0 ? trackImages : null;
  },
}));
