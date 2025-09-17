"use client";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlayerStore } from "@/store/playerStore";

export const useAudioController = (audio: RefObject<HTMLAudioElement | null>) => {
  const { isPlaying, volume } = usePlaybackStore((state) => state);
  const { currentTrack } = usePlayerStore((state) => state);

  const objectUrlRef = useRef<string | null>(null);
  useEffect(() => {
    if (!audio?.current || !currentTrack) return;

    const currentAudio = audio.current;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    fetch(currentTrack.song)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        currentAudio.src = url;
        currentAudio.volume = volume;

        if (isPlaying) {
          currentAudio
            .play()
            .catch((err) => console.error("Error reproducir track prefeteado:", err));
        }
      })
      .catch((err) => console.error("Error prefetch audio:", err));
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
