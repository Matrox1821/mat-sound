"use client";
import { usePlayerStore } from "@/store/playerStore";
import type { contentProps } from "@/types";
import { Play } from "../Icons/Playback/Play";
import { usePlaybackStore } from "@/store/playbackStore";
import { Pause } from "../Icons/Playback/Pause";
import { useProgressStore } from "@/store/progressStore";
import { useUIStore } from "@/store/activeStore";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";

interface CarouselCardPlayButtonProps {
  track: contentProps;
}

const CarouselCardPlayButton = ({ track }: CarouselCardPlayButtonProps) => {
  const { currentTrack, setTrack, setUpcoming, setPlayingFrom, reset } = usePlayerStore(
    (state) => state
  );
  const { isPlaying, play, pause } = usePlaybackStore((state) => state);
  const { setDuration } = useProgressStore((state) => state);
  const { playerBarIsActive, activePlayerBar } = useUIStore((state) => state);
  const parsedTracks = track.tracks?.map((newTrack) => parseTrackByPlayer(newTrack));
  const parsedTrack = parseTrackByPlayer(track);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
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
      className="cursor-pointer play-button z-20 w-10 h-10 bg-background-950/90 opacity-0 absolute bottom-1 right-2 bg-primary text-white rounded-full p-2 hover:bg-primary/80 transition-colors"
    >
      {parsedTrack === currentTrack ? isPlaying ? <Pause /> : <Play /> : <Play />}
    </button>
  );
};

export default CarouselCardPlayButton;
