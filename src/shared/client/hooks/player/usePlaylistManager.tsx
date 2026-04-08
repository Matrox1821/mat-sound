"use client";
import { usePlayerStore } from "@/store/playerStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { useProgressStore } from "@/store/progressStore";
import { useMainHeight } from "../ui/useMainHeight";
import { useAppUIStore } from "@/store/appUIStore";
import { playerTrackProps } from "@/types/track.types";

export const usePlaylistManager = () => {
  const { togglePlay } = usePlaybackStore();
  const { historyIds, queueIds, upcomingIds } = usePlayerStore();

  const { setDuration } = useProgressStore();
  const { playerBarIsActive, activePlayerBar } = useAppUIStore();

  useMainHeight();

  const hasPrevious = historyIds.length > 0;
  const hasNext = queueIds.length > 1 || upcomingIds.length > 0;

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
