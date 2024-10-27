import { usePlayerStore } from "../../store/playerStore";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState, type RefObject } from "react";
import { Slider } from "../ui/Slider";
import { formatTime, rgbColor } from "../../shared/helpers";
import { BsSkipStartFill } from "react-icons/bs";
import { IoIosPlay } from "react-icons/io";
import { HiMiniPause } from "react-icons/hi2";
import { useProgress } from "src/hooks/usePogress";
import { usePlayer } from "src/hooks/usePlayer";

interface Props {
  audioElement: RefObject<HTMLAudioElement>;
}

export function PlayerScreen({ audioElement }: Props) {
  const { currentMusic, playerScreenIsOpen, setPlayerScreenIsOpen, isPlaying } =
    usePlayerStore((state) => state);
  const { handleNext, handlePlay, handlePrevious, playlistManager } =
    usePlayer(audioElement);
  const { currentTime } = useProgress(audioElement);
  const duration = audioElement?.current?.duration;
  const { color, accentColor } = rgbColor(currentMusic.track?.image);
  return (
    <div
      style={{
        background: `linear-gradient(rgba(${color},1), rgba(${accentColor},1) 90%)`,
      }}
      className={`p-6 ${
        playerScreenIsOpen ? "player-screen" : "player-screen is-closed"
      }`}
    >
      <button onClick={() => setPlayerScreenIsOpen(false)} className="w-7 h-7">
        <IoIosArrowDown className="w-7 h-7 text-white font-extrabold" />
      </button>
      <div className="w-full flex flex-col items-center">
        {currentMusic.track?.image && (
          <img
            src={currentMusic.track?.image}
            alt={currentMusic.track?.name}
            className="object-fill aspect-square w-full rounded-md my-10"
          />
        )}
        <div className="flex flex-col items-start w-full gap-6">
          <div>
            <h2 className="font-bold text-xl m-0 leading-5 ">
              {currentMusic.track?.name}
            </h2>
            <span className="text-xs font-medium opacity-80">
              {currentMusic.track?.album?.name &&
              currentMusic.track?.artist?.name
                ? `${currentMusic.track.artist?.name || ""} - ${
                    currentMusic.track.album?.name || ""
                  }`
                : currentMusic.track?.artist?.name || ""}
            </span>
          </div>
          <div className="w-full flex flex-col gap-1">
            <Slider
              value={[currentTime]}
              max={duration || 0}
              min={0}
              onValueChange={(value: number[]) => {
                const [newCurrentTime] = value;
                if (audioElement?.current) {
                  audioElement.current.currentTime = newCurrentTime;
                }
              }}
            />
            <div className="flex justify-between text-xs font-[rgba(var(--content))] opacity-80">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex w-full justify-center gap-10">
            <button onClick={handlePrevious}>
              <BsSkipStartFill
                className={
                  playlistManager?.hasPrevious
                    ? "w-10 h-10"
                    : "w-10 h-10 opacity-20"
                }
              />
            </button>
            <button
              className="w-14 h-14 bg-[rgba(var(--content),1)] rounded-full text-[rgba(var(--bg),1)] flex items-center justify-center"
              onClick={handlePlay}
            >
              {isPlaying ? (
                <HiMiniPause className="w-8 h-8" />
              ) : (
                <IoIosPlay className="w-8 h-8 ml-1" />
              )}
            </button>
            <button onClick={handleNext}>
              <BsSkipStartFill
                className={
                  playlistManager?.hasNext
                    ? "rotate-180 w-10 h-10"
                    : "rotate-180 w-10 h-10 opacity-20"
                }
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
