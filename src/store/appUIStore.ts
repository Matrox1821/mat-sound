import { create } from "zustand";

// Definimos sub-interfaces para mantener el orden
interface PlaylistDialogState {
  isVisible: boolean;
  trackId: string;
}

interface AppUIState {
  // --- ESTADOS ---
  // Player UI
  playerBarIsActive: boolean;
  playerRightMenuIsActive: boolean;
  playerScreenIsActive: boolean;

  // Layout UI
  asideIsExpanded: boolean;

  // Dialogs
  playlistDialog: PlaylistDialogState;

  // --- ACCIONES ---
  // Player Actions
  setPlayerBarIsActive: (isActive: boolean) => void;
  setPlayerRightMenuIsActive: (isActive: boolean) => void;
  setPlayerScreenIsActive: (isActive: boolean) => void;
  activePlayerBar: () => void;

  // Layout Actions
  setAsideIsExpanded: (isExpanded: boolean) => void;
  toggleAside: () => void;

  // Dialog Actions
  openPlaylistDialog: (trackId?: string) => void;
  closePlaylistDialog: () => void;
  togglePlaylistDialog: () => void;
}

// Extraemos el estado inicial para poder hacer resets fáciles si alguna vez lo necesitas
const initialState = {
  playerBarIsActive: false,
  playerScreenIsActive: false,
  playerRightMenuIsActive: false,
  asideIsExpanded: true,
  playlistDialog: {
    isVisible: false,
    trackId: "",
  },
};

export const useAppUIStore = create<AppUIState>((set) => ({
  ...initialState,

  // --- Implementación Player UI ---
  setPlayerBarIsActive: (isActive) => set({ playerBarIsActive: isActive }),
  activePlayerBar: () => set({ playerBarIsActive: true }),
  setPlayerScreenIsActive: (isActive) => set({ playerScreenIsActive: isActive }),
  setPlayerRightMenuIsActive: (isActive) => set({ playerRightMenuIsActive: isActive }),

  // --- Implementación Layout UI ---
  setAsideIsExpanded: (isExpanded) => set({ asideIsExpanded: isExpanded }),
  toggleAside: () => set((state) => ({ asideIsExpanded: !state.asideIsExpanded })),

  // --- Implementación Dialogs ---
  openPlaylistDialog: (trackId = "") =>
    set({
      playlistDialog: { isVisible: true, trackId },
    }),

  closePlaylistDialog: () =>
    set((state) => ({
      playlistDialog: { ...state.playlistDialog, isVisible: false },
    })),

  togglePlaylistDialog: () =>
    set((state) => ({
      playlistDialog: {
        ...state.playlistDialog,
        isVisible: !state.playlistDialog.isVisible,
      },
    })),
}));
