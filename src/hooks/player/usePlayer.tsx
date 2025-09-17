"use client";
import { useCallback, RefObject } from "react";
import { useMediaSession } from "./useMediaSession";
import { useAudioController } from "./useAudioController";
import { usePlayerStore } from "@/store/playerStore";
import type { storeTrackProps } from "@/types";
import { usePlaybackStore } from "@/store/playbackStore";

export const usePlayer = (audioRef: RefObject<HTMLAudioElement>) => {
  const { currentTrack, playlist, copiedPlaylist, openPlayerScreen } = usePlayerStore(
    (state) => state
  );

  const { isPlaying, isShuffled, play } = usePlaybackStore((state) => state);

  useMediaSession(audioRef, currentTrack);

  /*   // Type guard to ensure we have a valid storeTrackProps
  const isStoreTrackProps = (track: any): track is storeTrackProps => {
    return (
      track &&
      typeof track === "object" &&
      "id" in track &&
      "title" in track &&
      "artist" in track &&
      "image" in track &&
      "url" in track &&
      "duration" in track
    );
  }; */

  return {
    currentTrack,
    playlist,
    copiedPlaylist,
    isPlaying,
    openPlayerScreen,
  };
};
