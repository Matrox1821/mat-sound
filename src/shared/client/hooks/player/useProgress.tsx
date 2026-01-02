"use client";
import { useEffect, useState, type RefObject } from "react";
import { usePlaybackStore } from "@/store/playbackStore";
import { useProgressStore } from "@/store/progressStore";
import { usePlayerStore } from "@/store/playerStore";

export const useProgress = (audioRef: RefObject<HTMLAudioElement | null>) => {
  const { loopMode } = usePlaybackStore((state) => state);
  const { next } = usePlayerStore((state) => state);
  const { currentTime, setCurrentTime, duration } = useProgressStore((state) => state);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // --- TIME UPDATE ---
    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }

      if ("mediaSession" in navigator && duration && duration > 0) {
        const safePosition = Math.min(audio.currentTime, duration - 0.01);

        navigator.mediaSession.setPositionState({
          duration,
          position: safePosition,
        });
      }
    };

    // --- TRACK ENDED ---
    const handleEnded = () => {
      audio.currentTime = 0;
      setCurrentTime(0);
      audio.play().catch(console.error);
      next();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioRef, loopMode, next, isDragging, duration, setCurrentTime, currentTime]);

  return {
    currentTime,
    setCurrentTime,
    duration,
    isDragging,
    setIsDragging,
  };
};
