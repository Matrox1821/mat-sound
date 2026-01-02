"use client";
import { useUIStore } from "@/store/activeStore";
import { useEffect } from "react";

export const useMainHeight = () => {
  const { playerBarIsActive } = useUIStore((state) => state);

  useEffect(() => {
    if (!playerBarIsActive) return;
    const updateHeight = () => {
      const footer = document.querySelector("footer");
      const root = document.querySelector("div#root") as HTMLElement;
      const footerHeight = footer?.getBoundingClientRect().height || 0;
      const windowHeight = window.innerHeight;

      root.style.setProperty("height", `${windowHeight - footerHeight}px`, "important");
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [playerBarIsActive]);
};
