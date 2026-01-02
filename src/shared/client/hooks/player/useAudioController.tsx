"use client";
import { useEffect } from "react";
import type { RefObject } from "react";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";

export const useAudioController = (audio: RefObject<HTMLAudioElement | null>) => {
  const { isPlaying, volume } = usePlaybackStore((state) => state);
  const { currentTrack } = usePlayerStore((state) => state);

  useEffect(() => {
    if (!audio?.current || !currentTrack) return;

    const currentAudio = audio.current;
    let cancelled = false;
    // Reset completo del audio (evita AbortError + NotSupportedError)
    currentAudio.pause();
    currentAudio.removeAttribute("src");
    currentAudio.load();

    // Asignar nuevo audio
    currentAudio.src = currentTrack.song;
    currentAudio.volume = volume;

    // Reproducir solo cuando esté listo
    const onLoadedMetadata = () => {
      if (cancelled) return;

      if (isPlaying) {
        currentAudio.play().catch((err) => {
          console.error("Error al reproducir:", err);
        });
      }
    };

    currentAudio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      cancelled = true;
      currentAudio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [currentTrack, audio]);

  useEffect(() => {
    if (!audio?.current) return;

    if (isPlaying) {
      audio.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    } else {
      audio.current.pause();
    }
  }, [isPlaying, audio]);

  useEffect(() => {
    if (!audio?.current) return;

    audio.current.volume = volume;
  }, [volume, audio]);
};
