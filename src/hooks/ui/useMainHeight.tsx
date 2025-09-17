"use client";
import { useUIStore } from "@/store/activeStore";
import { useEffect, useState } from "react";

export const useMainHeight = () => {
  const { playerBarIsActive } = useUIStore((state) => state);

  useEffect(() => {
    if (!playerBarIsActive) return;
    const updateHeight = () => {
      const footer = document.querySelector("footer");
      const root = document.querySelector("div#root") as HTMLElement;
      console.log(root.clientHeight);
      const footerHeight = footer?.getBoundingClientRect().height || 0;
      const windowHeight = window.innerHeight;

      root.style.setProperty("height", `${windowHeight - footerHeight}px`, "important");
      console.log(root.clientHeight);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [playerBarIsActive]);
};
