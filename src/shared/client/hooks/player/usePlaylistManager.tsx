"use client";
import { usePlayerStore } from "@/store/playerStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { useProgressStore } from "@/store/progressStore";
import { useMainHeight } from "../ui/useMainHeight";
import { useUIStore } from "@/store/activeStore";
import { playerTrackProps } from "@shared-types/track.types";

export const usePlaylistManager = () => {
  const { togglePlay } = usePlaybackStore();
  const { history, queue, upcoming } = usePlayerStore();
  const { setDuration } = useProgressStore();
  const { playerBarIsActive, activePlayerBar } = useUIStore();

  useMainHeight();

  const hasPrevious = history.length > 0;
  const hasNext = queue.length > 1 || upcoming.length > 0;

  const handlePlayPause = (track?: playerTrackProps) => {
    if (!playerBarIsActive) activePlayerBar();
    togglePlay();
    if (track) setDuration(track.duration);
  };

  return {
    hasPrevious,
    hasNext,
    handlePlayPause,
  };
};
