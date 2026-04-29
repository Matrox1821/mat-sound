"use client";
import { usePlayerStore } from "@/store/playerStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { useAppUIStore } from "@/store/appUIStore";
import { Pause } from "@components/ui/icons/playback/Pause";
import { Play } from "@components/ui/icons/playback/Play";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { useEffect } from "react";
import { playerTrackProps } from "@/types/track.types";

export const PlayButton = ({
  tracks,
  playingFrom,
  iconStyles,
  className,
}: {
  tracks: playerTrackProps[] | null;
  playingFrom: { from: string; href: string };
  iconStyles?: string;
  className?: string;
}) => {
  const { getCurrentTrack, setTrack, setPlayingFrom, reset, refillUpcoming } = usePlayerStore(
    (state) => state,
  );
  const currentTrack = getCurrentTrack();
  const { error } = useToast();
  const { isPlaying, play, pause } = usePlaybackStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useAppUIStore((state) => state);

  useEffect(() => {
    if (!currentTrack) return;
    refillUpcoming();
  }, [currentTrack, refillUpcoming]);

  if (!tracks || !tracks[0]) return;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!tracks[0] || !tracks[0].song) {
      error("No existe una pista de audio para reproducir.");
      return;
    }

    if (!playerBarIsActive) activePlayerBar();

    if (tracks[0].id === currentTrack?.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      reset();
      setTrack(tracks[0], tracks || []);
      setPlayingFrom(playingFrom);
      refillUpcoming();
      play();
    }
  };
  /* bg-background-950/90 */
  return (
    <button
      onClick={handleClick}
      className={`${tracks[0].song ? "cursor-pointer" : "cursor-not-allowed"} play-button z-20 absolute text-white rounded-full p-2 transition-colors ${className}`}
    >
      {tracks[0].id === currentTrack?.id && isPlaying ? (
        <Pause className={iconStyles} />
      ) : (
        <Play className={iconStyles} />
      )}
    </button>
  );
};
