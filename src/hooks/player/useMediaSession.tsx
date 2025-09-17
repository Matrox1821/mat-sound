"use client";
import { useEffect } from "react";
import type { RefObject } from "react";
import type { contentProps } from "@/types";

export const useMediaSession = (
  audio: RefObject<HTMLAudioElement> | undefined,
  currentTrack: contentProps | null = null
) => {
  useEffect(() => {
    if (!audio?.current || !currentTrack) return;

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.name,
        artist: currentTrack.artists
          ? currentTrack.artists[0].artist.name
          : currentTrack.artist?.name,
        artwork: [
          {
            src:
              typeof currentTrack.image === "string" ? currentTrack.image : currentTrack.image[0],
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
