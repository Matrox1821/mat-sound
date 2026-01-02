import { create } from "zustand";

type State = {
  history: string[];
  pointer: number;

  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => string | null;
  forward: () => string | null;

  canGoBack: () => boolean;
  canGoForward: () => boolean;
  goToIndex: (index: number) => string | null;
  clear: () => void;
};

export const useNavigationStore = create<State>((set, get) => ({
  history: [],
  pointer: -1,

  push: (path) => {
    const { history, pointer } = get();

    // Si la ruta es la misma que la actual, no hacemos nada
    const current = history[pointer];
    if (current === path) return;

    // truncamos el futuro y agregamos la nueva ruta
    const newHistory = [...history.slice(0, pointer + 1), path];

    set({ history: newHistory, pointer: newHistory.length - 1 });
  },

  replace: (path) => {
    const { history, pointer } = get();
    if (pointer < 0) {
      // si no hay nada, simplemente pusheamos
      set({ history: [path], pointer: 0 });
      return;
    }
    const newHistory = [...history];
    newHistory[pointer] = path;
    set({ history: newHistory });
  },

  back: () => {
    const { pointer, history } = get();
    if (pointer <= 0) return null;
    const newPointer = pointer - 1;
    set({ pointer: newPointer });
    return history[newPointer]; // <-- devolver la ruta tras mover el pointer
  },

  forward: () => {
    const { pointer, history } = get();
    if (pointer >= history.length - 1) return null;
    const newPointer = pointer + 1;
    set({ pointer: newPointer });
    return history[newPointer]; // <-- devolver la ruta tras mover el pointer
  },

  canGoBack: () => get().pointer > 0,
  canGoForward: () => get().pointer < get().history.length - 1,

  goToIndex: (index: number) => {
    const { history } = get();
    if (index < 0 || index >= history.length) return null;
    set({ pointer: index });
    return history[index];
  },

  clear: () => set({ history: [], pointer: -1 }),
}));
