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

interface PlayerState {
  // --- FUENTE DE LA VERDAD ---
  trackCache: Map<string, playerTrackProps>;

  // --- ORDEN Y ESTADO (Solo IDs) ---
  playingFrom: string;
  currentTrackId: string | null;
  historyIds: string[];
  queueIds: string[];
  upcomingIds: string[];
  snapshot: {
    historyIds: string[];
    queueIds: string[];
  } | null;

  // --- ACCIONES ---
  setPlayingFrom: (info: string) => void;
  /** Agrega pistas al caché interno sin alterar las listas de reproducción */
  addTracksToCache: (tracks: playerTrackProps[]) => void;
  setTrack: (track: playerTrackProps, queue?: playerTrackProps[]) => void;
  setUpcoming: (tracks: playerTrackProps[]) => void;
  next: () => void;
  prev: () => void;
  shuffleOn: () => void;
  shuffleOff: () => void;
  reset: () => void;
  updateTrackMetadata: (trackId: string, metadata: Partial<playerTrackProps>) => void;

  // --- SELECTORES (Helpers para la UI) ---
  getCurrentTrack: () => playerTrackProps | null;
  getTrackFromCache: (id: string) => playerTrackProps | undefined;
}

const initialState = {
  playingFrom: "",
  currentTrackId: null,
  historyIds: [],
  queueIds: [],
  upcomingIds: [],
  snapshot: null,
  trackCache: new Map(),
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...initialState,

  setPlayingFrom: (info) => set({ playingFrom: info }),

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
      // Bucle once: podrías reiniciar progreso externamente
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

    // Actualizamos el progreso usando el caché
    const nextTrack = store.getTrackFromCache(nextTrackId);
    if (nextTrack) setDuration(nextTrack.duration);

    set({
      currentTrackId: nextTrackId,
      queueIds: newQueueIds,
      historyIds: newHistoryIds,
      upcomingIds: newUpcomingIds,
      snapshot: newSnapshot,
    });
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
      // ¡Mira qué limpio! Solo actualizamos un lugar.
      const track = state.trackCache.get(trackId);
      if (!track) return state;

      const nextCache = new Map(state.trackCache);
      nextCache.set(trackId, { ...track, ...metadata });

      return { trackCache: nextCache };
    }),

  reset: () => set({ ...initialState, trackCache: new Map() }), // Asegurarse de limpiar el caché
}));
