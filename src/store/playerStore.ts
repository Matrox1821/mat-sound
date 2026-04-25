import { create } from "zustand";
import { usePlaybackStore } from "./playbackStore";
import { useProgressStore } from "./progressStore";
import { playerTrackProps } from "@shared-types/track.types";

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

function getLoopMode() {
  return usePlaybackStore.getState().loopMode;
}

function setDuration(duration: number) {
  return useProgressStore.getState().setDuration(duration);
}

export interface FetchUpcomingContext {
  playingFrom: { from: string; href: string } | null;
  currentTrackId: string;
  upcomingIds: string[]; // los que ya tenemos (para no repetir)
  historyIds: string[];
}

interface PlayerState {
  // --- FUENTE DE LA VERDAD ---
  trackCache: Map<string, playerTrackProps>;

  // --- ORDEN Y ESTADO (Solo IDs) ---
  playingFrom: { from: string; href: string } | null;
  currentTrackId: string | null;
  historyIds: string[];
  queueIds: string[];
  upcomingIds: string[];
  snapshot: {
    historyIds: string[];
    queueIds: string[];
  } | null;
  _isFetchingUpcoming: boolean;
  // Config del fetcher (se inyecta una vez al inicializar)
  _fetchUpcoming: ((context: FetchUpcomingContext) => Promise<playerTrackProps[]>) | null;
  setFetchUpcoming: (fn: (ctx: FetchUpcomingContext) => Promise<playerTrackProps[]>) => void;
  // Trigger manual (útil para testing o forzar recarga)
  refillUpcoming: () => Promise<void>;
  // --- ACCIONES ---
  setPlayingFrom: ({ from, href }: { from: string; href: string }) => void;
  /** Agrega pistas al caché interno sin alterar las listas de reproducción */
  addTracksToCache: (tracks: playerTrackProps[]) => void;
  setTrack: (track: playerTrackProps, queue?: playerTrackProps[]) => void;
  setUpcoming: (tracks: playerTrackProps[]) => void;
  next: () => void;
  prev: () => void;
  shuffleOn: () => void;
  shuffleOff: () => void;
  playShufflePlaylistOn: ({
    tracks,
    from,
    upcoming,
  }: {
    tracks: playerTrackProps[];
    from: { from: string; href: string } | null;
    upcoming?: playerTrackProps[] | null;
  }) => void;
  reset: () => void;
  updateTrackMetadata: (trackId: string, metadata: Partial<playerTrackProps>) => void;

  // --- SELECTORES (Helpers para la UI) ---
  getCurrentTrack: () => playerTrackProps | null;
  getTrackFromCache: (id: string) => playerTrackProps | undefined;
}

const initialState = {
  playingFrom: null,
  currentTrackId: null,
  historyIds: [],
  queueIds: [],
  upcomingIds: [],
  snapshot: null,
  trackCache: new Map(),
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...initialState,
  _fetchUpcoming: null,
  _isFetchingUpcoming: false,
  setPlayingFrom: ({ from, href }) => set({ playingFrom: { from, href } }),

  // Helper interno para popular el diccionario
  addTracksToCache: (tracks) =>
    set((state) => {
      const nextCache = new Map(state.trackCache);
      tracks.forEach((t) => nextCache.set(t.id, t));
      return { trackCache: nextCache };
    }),

  getCurrentTrack: () => {
    const { currentTrackId, trackCache } = get();
    if (!currentTrackId) return null;
    return trackCache.get(currentTrackId) || null;
  },

  getTrackFromCache: (id) => get().trackCache.get(id),

  setTrack: (track, newQueue) => {
    const store = get();
    setDuration(track.duration);

    // 1. Nos aseguramos de que el track actual y la nueva cola estén en caché
    store.addTracksToCache(newQueue ? [track, ...newQueue] : [track]);

    // 2. Extraemos solo los IDs para las listas
    const trackIndex = newQueue?.findIndex((queueTrack) => queueTrack.id === track.id);
    let historyIds: string[] = [];
    let queueIds: string[] = [];

    if (newQueue && trackIndex !== undefined && trackIndex > -1) {
      const newQueueIds = newQueue.map((t) => t.id);
      historyIds = newQueueIds.slice(0, trackIndex);
      queueIds = newQueueIds.slice(trackIndex);
    } else {
      queueIds = [track.id];
    }

    set({
      historyIds,
      currentTrackId: track.id,
      queueIds,
      // Mantenemos upcoming intacto
    });
  },

  next: () => {
    const store = get();
    const loop = getLoopMode();
    const currentId = store.currentTrackId;

    if (!currentId) return;

    if (loop === "once") {
      return;
    }

    let nextTrackId: string | null = null;
    let newQueueIds = [...store.queueIds];
    let newUpcomingIds = [...store.upcomingIds];
    let newHistoryIds = [...store.historyIds, currentId];

    if (store.queueIds.length > 1) {
      nextTrackId = store.queueIds[1];
      newQueueIds = store.queueIds.slice(1);
    } else if (loop === "all") {
      const fullCycle = [...store.historyIds, currentId];
      nextTrackId = fullCycle[0];
      newQueueIds = fullCycle;
      newHistoryIds = [];
    } else if (store.upcomingIds.length > 0) {
      nextTrackId = store.upcomingIds[0];
      newQueueIds = [nextTrackId];
      newUpcomingIds = store.upcomingIds.slice(1);
    }

    if (!nextTrackId) return;

    // Actualizamos snapshot si estamos en shuffle
    let newSnapshot = store.snapshot;
    if (store.snapshot) {
      newSnapshot = {
        historyIds: [...store.snapshot.historyIds, currentId],
        queueIds: store.snapshot.queueIds.filter((id) => id !== currentId),
      };
    }

    const nextTrack = store.getTrackFromCache(nextTrackId);
    if (nextTrack) setDuration(nextTrack.duration);

    set({
      currentTrackId: nextTrackId,
      queueIds: newQueueIds,
      historyIds: newHistoryIds,
      upcomingIds: newUpcomingIds,
      snapshot: newSnapshot,
    });

    if (newUpcomingIds.length <= 5) {
      get().refillUpcoming();
    }
  },

  setFetchUpcoming: (fn) => set({ _fetchUpcoming: fn }),

  refillUpcoming: async () => {
    const store = get();

    if (!store._fetchUpcoming || !store.currentTrackId) return;
    if (store.upcomingIds.length > 10) return;
    if (store._isFetchingUpcoming) return;
    set({ _isFetchingUpcoming: true });

    try {
      const newTracks = await store._fetchUpcoming({
        playingFrom: store.playingFrom,
        currentTrackId: store.currentTrackId,
        upcomingIds: store.upcomingIds,
        historyIds: store.historyIds,
      });

      if (newTracks.length === 0) return;

      store.addTracksToCache(newTracks);
      set((state) => ({
        upcomingIds: [...state.upcomingIds, ...newTracks.map((t) => t.id)],
      }));
    } finally {
      set({ _isFetchingUpcoming: false });
    }
  },

  prev: () => {
    const store = get();
    const lastId = store.historyIds.at(-1);

    if (!lastId) return;

    const lastTrack = store.getTrackFromCache(lastId);
    if (lastTrack) setDuration(lastTrack.duration);

    set({
      currentTrackId: lastId,
      historyIds: store.historyIds.slice(0, -1),
      queueIds: [lastId, ...store.queueIds],
    });
  },

  setUpcoming: (tracks) => {
    if (tracks.length === 0) return;
    const store = get();
    // Guardamos las canciones completas en el caché
    store.addTracksToCache(tracks);
    // Y guardamos solo sus IDs en upcoming
    set({ upcomingIds: tracks.map((t) => t.id) });
  },

  shuffleOn: () => {
    const store = get();
    if (!store.currentTrackId) return;

    set({
      snapshot: {
        historyIds: [...store.historyIds],
        queueIds: [...store.queueIds],
      },
    });

    const currentId = store.currentTrackId;
    const pool = [...store.historyIds, ...store.queueIds.slice(1)];
    const mixed = shuffle(pool); // Barajamos solo IDs

    set({
      historyIds: [],
      queueIds: [currentId, ...mixed],
    });
  },

  playShufflePlaylistOn: ({ tracks, from, upcoming }) => {
    const mixed = shuffle(tracks.map(({ id }) => id));
    const { setDuration } = useProgressStore.getState();

    get().addTracksToCache(tracks ? tracks : []);
    get().addTracksToCache(upcoming ? upcoming : []);

    setDuration(tracks.find(({ id }) => id === mixed[0])?.duration || 0);
    const indexTrack = tracks.findIndex(({ id }) => id === mixed[0]);
    const { toggleShuffle } = usePlaybackStore.getState();
    toggleShuffle();
    if (upcoming) set({ upcomingIds: upcoming.map((t) => t.id) });
    set({
      snapshot: {
        historyIds: tracks.map(({ id }) => id).slice(0, indexTrack),
        queueIds: tracks.map(({ id }) => id).slice(indexTrack),
      },

      historyIds: [],
      currentTrackId: mixed[0],
      queueIds: [...mixed],
      playingFrom: from,
    });
  },

  shuffleOff: () => {
    const store = get();
    if (!store.snapshot || !store.currentTrackId) return;

    const { historyIds: oldHistory, queueIds: oldQueue } = store.snapshot;
    const currentId = store.currentTrackId;

    const fullOriginalList = [...oldHistory, ...oldQueue];
    const currentIndex = fullOriginalList.indexOf(currentId);

    if (currentIndex === -1) {
      set({ snapshot: null });
      return;
    }

    const newHistoryIds = fullOriginalList.slice(0, currentIndex);
    const newQueueIds = fullOriginalList.slice(currentIndex);

    set({
      historyIds: newHistoryIds,
      queueIds: newQueueIds,
      snapshot: null,
    });
  },

  updateTrackMetadata: (trackId, metadata) =>
    set((state) => {
      const track = state.trackCache.get(trackId);
      if (!track) return state;

      const nextCache = new Map(state.trackCache);
      nextCache.set(trackId, { ...track, ...metadata });

      return { trackCache: nextCache };
    }),

  reset: () => set({ ...initialState, trackCache: new Map() }),
}));
