"use client";
import { usePlayerStore } from "@/store/playerStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { useAppUIStore } from "@/store/appUIStore";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { Pause } from "@components/ui/icons/playback/Pause";
import { Play } from "@components/ui/icons/playback/Play";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { TrackById } from "@shared-types/track.types";
import { useEffect } from "react";
import { MediaCard } from "@/types/content.types";

interface CarouselCardPlayButtonProps {
  track: MediaCard | TrackById;
}

export const CarouselCardPlayButton = ({ track }: CarouselCardPlayButtonProps) => {
  const { getCurrentTrack, setTrack, reset, refillUpcoming } = usePlayerStore((state) => state);
  const currentTrack = getCurrentTrack();
  const { error } = useToast();
  const { isPlaying, play, pause } = usePlaybackStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useAppUIStore((state) => state);
  function isContentTrack(track: MediaCard | TrackById): track is MediaCard & { type: "tracks" } {
    return "type" in track && track.type === "tracks";
  }
  useEffect(() => {
    if (!currentTrack) return;
    refillUpcoming();
  }, [currentTrack, refillUpcoming]);

  if (isContentTrack(track) && track.type !== "tracks") {
    return null;
  }
  /*   const parsedTracks = isContentTrack(track)
    ? track.recommendedTracks?.map((newTrack) => parseTrackByPlayer(newTrack))
    : []; */
  const parsedTrack = parseTrackByPlayer(track);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!parsedTrack.song) {
      error("No existe una pista de audio para reproducir.");
      return;
    }

    if (!playerBarIsActive) activePlayerBar();
    if (parsedTrack.id === currentTrack?.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      reset();
      setTrack(parsedTrack, [parsedTrack]);
      /*   setPlayingFrom({from:parsedTrack.name}); */
      refillUpcoming();
      play();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${parsedTrack.song ? "cursor-pointer" : "cursor-not-allowed"} play-button z-20 w-10 h-10 bg-background-950/90 opacity-0 absolute bottom-1 right-2 bg-primary text-white rounded-full p-2 hover:bg-primary/80 transition-colors`}
    >
      {parsedTrack.id === currentTrack?.id ? isPlaying ? <Pause /> : <Play /> : <Play />}
    </button>
  );
};
