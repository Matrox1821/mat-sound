import { useEffect } from "react";

export function useClickAway(ref: React.RefObject<HTMLElement | null>, onClickAway: () => void) {
  useEffect(() => {
    function handle(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway();
      }
    }

    document.addEventListener("click", handle); // 👈 cambiar aquí
    return () => document.removeEventListener("click", handle);
  }, [ref, onClickAway]);
}
