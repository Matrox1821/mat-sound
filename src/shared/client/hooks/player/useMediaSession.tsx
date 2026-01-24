"use client";
import { playerTrackProps } from "@/types/track.types";
import { useEffect } from "react";
import type { RefObject } from "react";

export const useMediaSession = (
  audio: RefObject<HTMLAudioElement> | undefined,
  currentTrack: playerTrackProps | null = null,
) => {
  useEffect(() => {
    if (!audio?.current || !currentTrack) return;

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.name,
        artist: currentTrack.artists ? currentTrack.artists[0].name : "",
        artwork: [
          {
            src: currentTrack.cover.sm,
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        audio.current?.play();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        audio.current?.pause();
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => {});

      navigator.mediaSession.setActionHandler("nexttrack", () => {});
    }
  }, [audio, currentTrack]);
};
