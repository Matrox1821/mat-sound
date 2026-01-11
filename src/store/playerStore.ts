import { playerTrackProps } from "@/types/trackProps";
import { usePlaybackStore } from "./playbackStore";
import { create } from "zustand";
import { useProgressStore } from "./progressStore";

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

    if (loop === "once" && store.currentTrack) {
      return;
    }

    const hasNext = store.queue.length > 1;
    if (hasNext) {
      const nextTrack = store.queue[1];
      const newQueue = store.queue.slice(1);
      setDuration(nextTrack.duration);
      set({
        currentTrack: nextTrack,
        queue: newQueue,
        history: [...store.history, current],
      });
      return;
    }

    if (loop === "all") {
      const full = [...store.history, current];

      if (full.length === 0) return;

      const nextTrack = full[0];
      const newQueue = full;
      setDuration(nextTrack.duration);
      set({
        currentTrack: nextTrack,
        queue: newQueue,
        history: [],
      });
      return;
    }

    if (store.upcoming.length > 0) {
      const nextTrack = store.upcoming[0];
      const newQueue = [nextTrack];

      // push current into history
      const newHistory = store.currentTrack
        ? [...store.history, store.currentTrack]
        : [...store.history];
      setDuration(nextTrack.duration);
      set({
        currentTrack: nextTrack,
        queue: newQueue,
        history: newHistory,
        upcoming: store.upcoming.slice(1),
      });
      return;
    }
    return;
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

    const { history, queue, currentTrack } = store;
    if (!currentTrack) return;

    const indexInHistory = history.findIndex((t) => t.id === currentTrack.id);
    const indexInQueue = queue.findIndex((t) => t.id === currentTrack.id);

    let newHistory = [...history];
    let newQueue = [...queue];
    if (indexInHistory !== -1) {
      const before = history.slice(0, indexInHistory);

      const after = history.slice(indexInHistory);

      newHistory = before;
      newQueue = [...after, ...queue];

      set({
        history: newHistory,
        queue: newQueue,
        currentTrack,
      });
      return;
    }

    if (indexInQueue !== -1) {
      const before = queue.slice(0, indexInQueue);

      const after = queue.slice(indexInQueue);

      newHistory = [...history, ...before];
      newQueue = after;

      set({
        history: newHistory,
        queue: newQueue,
        currentTrack,
      });
      return;
    }

    newQueue = [currentTrack, ...queue];

    set({
      history: newHistory,
      queue: newQueue,
      currentTrack,
    });
  },
  updateTrackMetadata: (trackId, metadata) => {
    const { currentTrack, queue, history, upcoming } = get();

    // 1. Clonamos y actualizamos la Queue (incluye el current si está ahí)
    const newQueue = queue.map((track) =>
      track.id === trackId ? { ...track, ...metadata } : track
    );

    // 2. Actualizamos el CurrentTrack si coincide
    const newCurrentTrack =
      currentTrack?.id === trackId ? { ...currentTrack, ...metadata } : currentTrack;

    // 3. Actualizamos el Historial
    const newHistory = history.map((track) =>
      track.id === trackId ? { ...track, ...metadata } : track
    );

    // 4. Actualizamos Upcoming (Sugerencias)
    const newUpcoming = upcoming.map((track) =>
      track.id === trackId ? { ...track, ...metadata } : track
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
