"use client";
import { RefObject } from "react";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlaylistManager } from "@/hooks/player/usePlaylistManager";
import { Pause } from "@/components/UI/Icons/Playback/Pause";
import { Play } from "@/components/UI/Icons/Playback/Play";
import { Next, Prev } from "@/components/UI/Icons/Playback/SkipTo";

interface PlayerControllerProps {
  audioRef: RefObject<HTMLAudioElement>;
}

const PlayerController = ({ audioRef }: PlayerControllerProps) => {
  const { isShuffled, isPlaying, inLoop } = usePlaybackStore();
  const { handlePlayPause, handleNext, handlePrevious, hasNext, hasPrevious } =
    usePlaylistManager();

  return (
    <div className="flex items-center justify-center gap-4 h-full w-full">
      {/* <button
        onClick={handleShuffle}
        className={`text-xl ${isShuffled ? "text-primary" : "text-background-500"}`}
      >
        <i className="fas fa-random" />
      </button> */}
      <button
        onClick={handlePrevious}
        className={`flex items-center justify-center text-xl h-10 w-10 ${
          hasPrevious ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <Prev className={`${hasPrevious ? "text-white" : "text-white/50"}`} />
      </button>
      <button
        onClick={() => handlePlayPause()}
        className="flex items-center justify-center text-2xl h-10 w-10 cursor-pointer"
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>
      <button
        onClick={handleNext}
        className={`flex items-center justify-center text-xl h-10 w-10 ${
          hasNext ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <Next className={`${hasNext ? "text-white" : "text-white/50"}`} />
      </button>
      {/*  <button
        onClick={() => setLoopMode(!inLoop)}
        className={`text-xl ${inLoop ? "text-primary" : "text-background-500"}`}
      >
        <i className="fas fa-repeat" />
      </button> */}
    </div>
  );
};

export default PlayerController;
