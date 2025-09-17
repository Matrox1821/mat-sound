"use client";
import { useState, useEffect, RefObject } from "react";
import { randomizeArray } from "@/shared/helpers";
import { usePlayerStore } from "@/store/playerStore";
import type { contentProps } from "@/types";
import { usePlaybackStore } from "@/store/playbackStore";
import { useProgress } from "./useProgress";
import { useProgressStore } from "@/store/progressStore";
import { useMainHeight } from "../ui/useMainHeight";
import { useUIStore } from "@/store/activeStore";

export const usePlaylistManager = () => {
  const [playlistState, setPlaylistState] = useState({
    hasPrevious: false,
    hasNext: false,
  });

  const { isShuffled, toggleShuffle, togglePlay } = usePlaybackStore((state) => state);
  const {
    currentTrack,
    playlist,
    currentIndex,
    setCurrentTrack,
    copiedPlaylist,
    setCopiedPlaylist,
    setPlaylist,
  } = usePlayerStore((state) => state);
  const { setCurrentTime, setDuration } = useProgressStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useUIStore((state) => state);

  useMainHeight();

  useEffect(() => {
    const index = playlist?.findIndex((t: contentProps) => t.id === currentTrack?.id);
    if (index != null && index >= 0) {
      setPlaylistState({
        hasPrevious: index > 0,
        hasNext: index + 1 < playlist.length,
      });
    }
  }, [currentTrack, playlist]);

  //#region Handle state functions
  const handlePlayPause = (track?: contentProps) => {
    if (!playerBarIsActive) activePlayerBar();

    togglePlay();
    if (track) setDuration(track.duration);
  };

  const handleNext = () => {
    if (!playlist.length) return;

    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];

    if (nextTrack) {
      setCurrentTrack(nextTrack);
      setCurrentTime(0);
      setDuration(nextTrack.duration);
    }
  };

  const handlePrevious = () => {
    if (!playlist.length) return;

    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    const prevTrack = playlist[prevIndex];

    if (prevTrack) {
      setCurrentTrack(prevTrack);
      setCurrentTime(0);
      setDuration(prevTrack.duration);
    }
  };

  const handleShuffle = () => {
    toggleShuffle();
    if (isShuffled) {
      setPlaylist(copiedPlaylist);
    } else {
      setCopiedPlaylist(playlist);
      const shuffled = shuffle(playlist);
      setPlaylist(shuffled);
    }
  };

  //#endregion

  const getPreviousTrack = (): contentProps | null => {
    const index = playlist?.findIndex((t: contentProps) => t.id === currentTrack?.id);
    return index && index > 0 ? playlist[index - 1] : null;
  };

  const getNextTrack = (): contentProps | null => {
    const currentIndex = playlist.findIndex((t: contentProps) => t.id === currentTrack?.id);
    return currentIndex >= 0 && currentIndex + 1 < playlist.length
      ? playlist[currentIndex + 1]
      : null;
  };

  const getUpdatedPlaylist = (track: contentProps): contentProps[] => {
    if (!track) return playlist;
    const inOriginal = playlist.some((t: contentProps) => t.id === track.id);
    return inOriginal ? playlist : [...playlist, track];
  };

  const shuffle = (playlist: contentProps[]): contentProps[] => {
    return randomizeArray(playlist);
  };

  return {
    ...playlistState,
    getPreviousTrack,
    getNextTrack,
    getUpdatedPlaylist,
    shuffle,
    handlePlayPause,
    handleNext,
    handlePrevious,
  };
};
