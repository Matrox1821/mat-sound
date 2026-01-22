"use client";
import { useEffect } from "react";
import type { RefObject } from "react";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";

export const useAudioController = (audioRef: RefObject<HTMLAudioElement | null>) => {
  const { isPlaying, volume } = usePlaybackStore();
  const songUrl = usePlayerStore((state) => state.currentTrack?.song);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !songUrl) return;

    let cancelled = false;

    el.pause();
    el.removeAttribute("src");
    el.load();
    el.src = songUrl;

    const onLoadedMetadata = () => {
      if (cancelled) return;
      if (isPlaying) {
        el.play().catch((err) => console.error("Error play:", err));
      }
    };

    el.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      cancelled = true;
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [songUrl]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !el.src) return;

    if (isPlaying) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isPlaying, audioRef]);

  useEffect(() => {
    const el = audioRef.current;
    if (el) {
      el.volume = volume;
    }
  }, [volume, audioRef]);
};
