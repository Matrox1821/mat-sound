"use client";
import { usePlayerStore } from "@/store/playerStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { useProgressStore } from "@/store/progressStore";
import { useUIStore } from "@/store/activeStore";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { Pause } from "@components/ui/icons/playback/Pause";
import { Play } from "@components/ui/icons/playback/Play";
import { ContentElement } from "@/types/content.types";
import { useToast } from "@/shared/client/hooks/ui/useToast";

interface CarouselCardPlayButtonProps {
  track: ContentElement;
}

const CarouselCardPlayButton = ({ track }: CarouselCardPlayButtonProps) => {
  const { currentTrack, setTrack, setUpcoming, setPlayingFrom, reset } = usePlayerStore(
    (state) => state,
  );
  const { error } = useToast();
  const { isPlaying, play, pause } = usePlaybackStore((state) => state);
  const { setDuration } = useProgressStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useUIStore((state) => state);

  if (track.type !== "tracks") {
    return null;
  }
  const parsedTracks = track.recommendedTracks?.map((newTrack) => parseTrackByPlayer(newTrack));
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
      setUpcoming(parsedTracks ? parsedTracks : []);
      setDuration(parsedTrack.duration);
      setPlayingFrom(parsedTrack.name);
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

export default CarouselCardPlayButton;
