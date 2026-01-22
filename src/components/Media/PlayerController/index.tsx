"use client";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlaylistManager } from "@/shared/client/hooks/player/usePlaylistManager";
import { Next, Prev } from "@/components/ui/icons/playback/SkipTo";
import { Shuffle } from "@/components/ui/icons/playback/Shuffle";
import { LoopAll, LoopOnce } from "@/components/ui/icons/playback/Loop";
import { usePlayerStore } from "@/store/playerStore";
import { Pause } from "@/components/ui/icons/playback/Pause";
import { Play } from "@/components/ui/icons/playback/Play";

const PlayerController = () => {
  const { isShuffled, isPlaying, setLoopMode, loopMode, toggleShuffle } = usePlaybackStore();
  const { next, prev, shuffleOff, shuffleOn } = usePlayerStore();
  const { handlePlayPause, hasNext, hasPrevious } = usePlaylistManager();
  const shuffle = () => {
    if (isShuffled) {
      shuffleOff();
    } else {
      shuffleOn();
    }
    toggleShuffle();
  };
  return (
    <div className="flex items-center justify-center gap-4 h-full w-full">
      <button
        onClick={shuffle}
        className={`w-8 h-8 flex items-center justify-center text-content-950 cursor-pointer ${
          isShuffled ? "text-primary bg-background-600 rounded-xl" : ""
        }`}
      >
        <Shuffle className="w-4 h-4 hover:text-white/80" />
      </button>
      <button
        onClick={prev}
        disabled={!hasPrevious}
        className={`flex items-center justify-center text-xl h-10 w-10 cursor-pointer`}
      >
        <Prev className="text-white hover:text-white/80" />
      </button>
      <button
        onClick={() => handlePlayPause()}
        className="flex items-center justify-center text-2xl h-10 w-10 cursor-pointer"
      >
        {isPlaying ? (
          <Pause className="hover:text-white/80 h-8 w-8" />
        ) : (
          <Play className="hover:text-white/80 h-8 w-8" />
        )}
      </button>
      <button
        onClick={next}
        disabled={!hasNext}
        className={`flex items-center justify-center text-xl h-10 w-10  cursor-pointer `}
      >
        <Next className="text-white hover:text-white/80" />
      </button>
      <button
        onClick={() =>
          setLoopMode(loopMode === "none" ? "all" : loopMode === "all" ? "once" : "none")
        }
        className={`w-8 h-8 cursor-pointer flex items-center justify-center text-content-950 ${
          loopMode !== "none" ? "text-primary bg-background-600 rounded-xl" : ""
        }`}
      >
        {loopMode !== "once" ? (
          <LoopAll className="w-4 h-4 hover:text-white/80" />
        ) : (
          <LoopOnce className="w-4 h-4 hover:text-white/80" />
        )}
      </button>
    </div>
  );
};

export default PlayerController;
