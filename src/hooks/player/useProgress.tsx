"use client";
import { useEffect, useState, type RefObject } from "react";
import { usePlaylistManager } from "./usePlaylistManager";
import { usePlaybackStore } from "@/store/playbackStore";
import { useProgressStore } from "@/store/progressStore";

export const useProgress = (audioRef: RefObject<HTMLAudioElement | null>) => {
  const { inLoop } = usePlaybackStore((state) => state);
  const { currentTime, setCurrentTime, duration } = useProgressStore((state) => state);
  const { handleNext } = usePlaylistManager();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!audioRef?.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }

      if ("mediaSession" in navigator) {
        updatePositionState(duration, audio.currentTime);
      }

      if (audio.currentTime === duration && !isDragging) {
        if (inLoop) {
          audio.currentTime = 0;
          setCurrentTime(0);
          audio.play().catch(console.error);
        } else {
          handleNext();
        }
      } else {
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioRef, inLoop, handleNext, isDragging]);

  const updatePositionState = (mediaDuration: number, position: number) => {
    navigator.mediaSession.setPositionState({
      duration: mediaDuration || 180,
      position,
    });
  };

  return {
    currentTime,
    setCurrentTime,
    duration,
    isDragging,
    setIsDragging,
  };
};
