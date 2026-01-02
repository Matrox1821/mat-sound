"use client";
import { useState, useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { useProgressStore } from "@/store/progressStore";
import { useMainHeight } from "../ui/useMainHeight";
import { useUIStore } from "@/store/activeStore";
import { playerTrackProps } from "@/types/trackProps";

export const usePlaylistManager = () => {
  const [playlistState, setPlaylistState] = useState({
    hasPrevious: false,
    hasNext: false,
  });

  const { togglePlay } = usePlaybackStore((state) => state);
  const { currentTrack, history, queue, upcoming } = usePlayerStore((state) => state);
  const { setDuration } = useProgressStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useUIStore((state) => state);

  useMainHeight();

  useEffect(() => {
    setPlaylistState({
      hasPrevious: history.length > 0,
      hasNext: queue.length > 0 || upcoming.length > 0,
    });
  }, [currentTrack, history, queue]);

  //#region Handle state functions
  const handlePlayPause = (track?: playerTrackProps) => {
    if (!playerBarIsActive) activePlayerBar();

    togglePlay();
    if (track) setDuration(track.duration);
  };

  /*   const handleNext = () => {
    if (!basePlaylist.length) return;
    const nextIndex = (currentIndex + 1) % basePlaylist.length;
    const nextTrack = basePlaylist[nextIndex];

    if (nextTrack) {
      setCurrentTrack(nextTrack);
      setCurrentTime(0);
      setCurrentIndex(nextIndex);
      setDuration(nextTrack.duration);
    }
  };

  const handlePrevious = () => {
    if (!basePlaylist.length) return;

    const prevIndex = currentIndex === 0 ? 0 : currentIndex - 1;
    const prevTrack = basePlaylist[prevIndex];

    if (currentIndex !== 0 && prevTrack) {
      setCurrentTrack(prevTrack);
      setCurrentTime(0);
      setCurrentIndex(prevIndex);
      setDuration(prevTrack.duration);
    }
  };
 */
  /*   const shuffle = (current: number, playlist: playerTrackProps[]): playerTrackProps[] => {
    return randomizeArrayExceptFirst(current, playlist);
  };
  const handleShuffle = () => {
    console.log({ basePlaylist, copiedBasePlaylist, playlistExtended });
    if (isShuffled) {
      toggleShuffle();
      setBasePlaylist(copiedBasePlaylist);
      const index = copiedBasePlaylist.findIndex(
        (track: playerTrackProps) => track.id === currentTrack?.id
      );
      setCurrentIndex(index);
      return;
    }
    // Activar shuffle → almacenar estado original
    setCopiedBasePlaylist([...basePlaylist]);

    toggleShuffle();
    const shuffled = shuffle(currentIndex, [...basePlaylist]);
    setCurrentIndex(0);
    setBasePlaylist([...shuffled]);
  }; */

  //#endregion

  /*   const getPreviousTrack = (): playerTrackProps | null => {
    const index = basePlaylist?.findIndex((t: playerTrackProps) => t.id === currentTrack?.id);
    return index && index > 0 ? basePlaylist[index - 1] : null;
  };

  const getNextTrack = (): playerTrackProps | null => {
    const currentIndex = basePlaylist.findIndex((t: playerTrackProps) => t.id === currentTrack?.id);
    return currentIndex >= 0 && currentIndex + 1 < basePlaylist.length
      ? basePlaylist[currentIndex + 1]
      : null;
  }; */
  /* 
  const getUpdatedPlaylist = (track: playerTrackProps): playerTrackProps[] => {
    if (!track) return basePlaylist;
    const inOriginal = basePlaylist.some((t: playerTrackProps) => t.id === track.id);
    return inOriginal ? basePlaylist : [...basePlaylist, track];
  }; */

  return {
    ...playlistState,
    handlePlayPause,
  };
};
