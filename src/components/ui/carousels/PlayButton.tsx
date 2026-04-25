"use client";
import { usePlayerStore } from "@/store/playerStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { useAppUIStore } from "@/store/appUIStore";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { Pause } from "@components/ui/icons/playback/Pause";
import { Play } from "@components/ui/icons/playback/Play";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { useEffect } from "react";
import { MediaCard } from "@/types/content.types";

export const PlayButton = ({ data }: { data: MediaCard }) => {
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

  /*   const parsedTracks = isContentTrack(track)
    ? track.recommendedTracks?.map((newTrack) => parseTrackByPlayer(newTrack))
    : []; */
  let parsedTrack = null,
    parsedQueue = null,
    playingFrom = "MIX";
  if (data.type === "tracks") {
    parsedTrack = parseTrackByPlayer(data);
    playingFrom = data.title;
    parsedQueue = [parsedTrack];
  }
  if (data.tracks && data.tracks.length > 0) {
    parsedTrack = parseTrackByPlayer(data.tracks[0]);
    parsedQueue = data.tracks.map((track: any) => parseTrackByPlayer(track));
    playingFrom = data.title;
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!parsedTrack) return;
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
      setTrack(parsedTrack, parsedQueue || []);
      setPlayingFrom({ from: playingFrom, href: `${data.type}/${data.id}` });
      refillUpcoming();
      play();
    }
  };
  if (!parsedTrack) return;
  return (
    <button
      onClick={handleClick}
      className={`${parsedTrack.song ? "cursor-pointer" : "cursor-not-allowed"} play-button z-20  bg-background-950/90 opacity-0 absolute bg-primary text-white rounded-full p-2 hover:bg-primary/80 transition-colors ${data.type === "artists" ? "w-2/4 h-2/4 bottom-7 right-9 flex items-center justify-center" : "w-10 h-10 bottom-1 right-2"}`}
    >
      {parsedTrack.id === currentTrack?.id && isPlaying ? (
        <Pause className={`${data.type === "artists" ? "w-3/4 h-3/4" : ""}`} />
      ) : (
        <Play className={`${data.type === "artists" ? "w-3/4 h-3/4" : ""}`} />
      )}
    </button>
  );
};
