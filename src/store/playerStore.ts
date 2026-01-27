import { usePlaybackStore } from "./playbackStore";
import { create } from "zustand";
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
  /**
   * Indicates from which source the current track is being played
   */
  playingFrom: string;

  /**
   * Tracks that were already played (history stack)
   */
  history: playerTrackProps[];

  /**
   * Current playback queue (current track is queue[0])
   */
  queue: playerTrackProps[];

  /**
   * Suggested tracks that are not part of the queue yet
   */
  upcoming: playerTrackProps[];

  /**
   * Current track playing
   */
  currentTrack: playerTrackProps | null;

  /**
   * Snapshot of the queue before shuffle (used to restore)
   */
  snapshot: {
    history: playerTrackProps[];
    queue: playerTrackProps[];
  } | null;

  /**
   * Sets the playback source label
   */
  setPlayingFrom: (info: string) => void;

  /**
   * Sets a new current track and optionally replaces the queue
   */
  setTrack: (track: playerTrackProps, queue?: playerTrackProps[]) => void;

  /**
   * Replaces the suggested upcoming tracks
   */
  setUpcoming: (tracks: playerTrackProps[]) => void;

  /**
   * Plays the next track in queue or upcoming
   */
  next: () => void;

  /**
   * Plays the previous track from history
   */
  prev: () => void;

  /**
   * Shuffle: keeps current track first and randomizes the rest
   */
  shuffleOn: () => void;

  /**
   * Restores queue order to what it was before shuffle
   */
  shuffleOff: () => void;

  /**
   * Reset the store to its initial state
   */
  reset: () => void;

  updateTrackMetadata: (trackId: string, metadata: Partial<playerTrackProps>) => void;
}

const initialState = {
  playingFrom: "",

  currentTrack: null,
  history: [],
  queue: [],
  upcoming: [],

  snapshot: null,
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...initialState,

  setPlayingFrom: (info) => set({ playingFrom: info }),

  setTrack: (track, newQueue) => {
    const store = get();
    setDuration(track.duration);

    const trackIndex = newQueue?.findIndex((queueTrack) => queueTrack.id === track.id);
    let history: playerTrackProps[] | null = [];
    let queue: playerTrackProps[] | null = [];

    if (newQueue && trackIndex && trackIndex > -1) {
      history = newQueue.slice(0, trackIndex);
      queue = newQueue.slice(trackIndex);
    }

    set({
      history: history,
      currentTrack: track,
      queue: queue.length > 0 ? queue : newQueue ? newQueue : [track],
      upcoming: store.upcoming,
    });
  },

  next: () => {
    const store = get();
    const loop = getLoopMode();
    const current = store.currentTrack;

    if (!current) return;

    // Lógica de bucle "once": Reinicia la misma canción
    if (loop === "once") {
      // Aquí podrías disparar un evento para reiniciar el progreso a 0
      return;
    }

    // 1. Determinar cuál es la siguiente canción
    let nextTrack: playerTrackProps | null = null;
    let newQueue = [...store.queue];
    let newUpcoming = [...store.upcoming];
    let newHistory = [...store.history, current];

    if (store.queue.length > 1) {
      // Caso normal: Hay más canciones en la cola (mezclada o no)
      nextTrack = store.queue[1];
      newQueue = store.queue.slice(1);
    } else if (loop === "all") {
      // Caso Loop All: Reconstruimos la cola desde el historial
      const fullCycle = [...store.history, current];
      nextTrack = fullCycle[0];
      newQueue = fullCycle;
      newHistory = [];
    } else if (store.upcoming.length > 0) {
      // Caso Upcoming: No hay más en cola, pero hay sugerencias
      nextTrack = store.upcoming[0];
      newQueue = [nextTrack];
      newUpcoming = store.upcoming.slice(1);
    }

    // 2. Si no hay siguiente canción, terminamos
    if (!nextTrack) return;

    // 3. ACTUALIZACIÓN DEL SNAPSHOT (Crucial para que ShuffleOff funcione)
    let newSnapshot = store.snapshot;
    if (store.snapshot) {
      // Si estamos en shuffle, el snapshot debe reflejar que el track actual
      // ya pasó al historial para que al apagar el shuffle la posición sea correcta.
      newSnapshot = {
        history: [...store.snapshot.history, current],
        queue: store.snapshot.queue.filter((t) => t.id !== current.id),
      };
    }

    // 4. Aplicar cambios al estado
    setDuration(nextTrack.duration);
    set({
      currentTrack: nextTrack,
      queue: newQueue,
      history: newHistory,
      upcoming: newUpcoming,
      snapshot: newSnapshot, // Mantenemos la integridad del orden original
    });
  },

  prev: () => {
    const store = get();
    const last = store.history.at(-1);
    if (!last) return;
    setDuration(last.duration);
    set({
      currentTrack: last,
      history: store.history.slice(0, -1),
      queue: [last, ...store.queue], // volverlo a poner como current implica recrear queue
    });
  },

  setUpcoming: (tracks) => {
    if (tracks.length === 0) return;
    set({ upcoming: tracks });
  },

  shuffleOn: () => {
    const store = get();
    if (!store.currentTrack) return;
    set({
      snapshot: {
        history: [...store.history],
        queue: [...store.queue],
      },
    });

    const current = store.currentTrack;

    const pool = [...store.history, ...store.queue.slice(1)];

    const mixed = shuffle(pool);

    set({
      history: [],
      queue: [current, ...mixed],
    });
  },

  shuffleOff: () => {
    const store = get();
    if (!store.snapshot || !store.currentTrack) return;

    const { history: oldHistory, queue: oldQueue } = store.snapshot;
    const currentId = store.currentTrack.id;

    // Unimos todo el orden original para encontrar dónde estamos parados
    const fullOriginalList = [...oldHistory, ...oldQueue];
    const currentIndex = fullOriginalList.findIndex((t) => t.id === currentId);

    if (currentIndex === -1) {
      // Si por alguna razón el track actual no estaba en el snapshot (ej. cambió por upcoming)
      set({
        snapshot: null,
        // Mantenemos lo que hay pero limpiamos el snapshot
      });
      return;
    }

    // Re-seccionamos la lista original basada en la posición actual
    const newHistory = fullOriginalList.slice(0, currentIndex);
    const newQueue = fullOriginalList.slice(currentIndex);

    set({
      history: newHistory,
      queue: newQueue,
      snapshot: null, // Limpiamos el snapshot para que el próximo shuffle sea limpio
    });
  },
  updateTrackMetadata: (trackId, metadata) => {
    const { currentTrack, queue, history, upcoming } = get();

    // 1. Clonamos y actualizamos la Queue (incluye el current si está ahí)
    const newQueue = queue.map((track) =>
      track.id === trackId ? { ...track, ...metadata } : track,
    );

    // 2. Actualizamos el CurrentTrack si coincide
    const newCurrentTrack =
      currentTrack?.id === trackId ? { ...currentTrack, ...metadata } : currentTrack;

    // 3. Actualizamos el Historial
    const newHistory = history.map((track) =>
      track.id === trackId ? { ...track, ...metadata } : track,
    );

    // 4. Actualizamos Upcoming (Sugerencias)
    const newUpcoming = upcoming.map((track) =>
      track.id === trackId ? { ...track, ...metadata } : track,
    );

    // Aplicamos todos los cambios de una sola vez para evitar re-renders innecesarios
    set({
      currentTrack: newCurrentTrack,
      queue: newQueue,
      history: newHistory,
      upcoming: newUpcoming,
    });
  },
  reset: () => set({ ...initialState }),
}));
