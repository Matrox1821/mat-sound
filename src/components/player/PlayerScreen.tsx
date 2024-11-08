import { usePlayerStore } from "../../store/playerStore";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, type RefObject } from "react";
import { Slider } from "../ui/Slider";
import { formatTime, rgbColor } from "../../shared/helpers";
import { BsSkipStartFill } from "react-icons/bs";
import { IoIosPlay } from "react-icons/io";
import { HiMiniPause } from "react-icons/hi2";
import { useProgress } from "src/hooks/usePogress";
import { usePlayer } from "src/hooks/usePlayer";
import { Playlist } from "./Playlist";
import { PiShuffleFill } from "react-icons/pi";
import { PiRepeatThin } from "react-icons/pi";
import { PiShuffleThin } from "react-icons/pi";
import { PiRepeatBold } from "react-icons/pi";
import { PiRepeatOnceBold } from "react-icons/pi";

interface Props {
  audioElement: RefObject<HTMLAudioElement>;
}

export function PlayerScreen({ audioElement }: Props) {
  const {
    currentMusic,
    playerScreenIsOpen,
    setPlayerScreenIsOpen,
    isPlaying,
    setInLoop,
    inLoop,
  } = usePlayerStore((state) => state);
  const {
    handleNext,
    handlePlay,
    handlePrevious,
    playlistManager,
    handleShuffle,
    handleLoop,
  } = usePlayer(audioElement);
  const { currentTime } = useProgress(audioElement);
  const duration = audioElement?.current?.duration;
  const { color, accentColor } = rgbColor(currentMusic.track?.image);

  return (
    <section
      style={{
        background: `linear-gradient(165deg,rgba(${color},1),rgba(${accentColor},1) 95%)`,
      }}
      className={`p-6 overflow-y-scroll scroll-smooth flex flex-col ${
        playerScreenIsOpen ? "player-screen" : "player-screen is-closed"
      }`}
      id="playerScreen"
    >
      <button
        onClick={() => {
          setPlayerScreenIsOpen(false);
          const body = document.querySelector("body");
          if (body) body.style.overflowY = "auto";
        }}
        className="w-7 h-7 rounded-full active:bg-black/30 flex items-center justify-center"
      >
        <IoIosArrowDown className="w-7 h-7 text-white font-extrabold" />
      </button>
      <article className="w-full flex flex-col items-center gap-6">
        <section className="h-[calc(100svh-40px)] justify-between flex flex-col">
          <article className="flex flex-col items-start w-full gap-6">
            {currentMusic.track?.image && (
              <img
                src={currentMusic.track?.image}
                alt={currentMusic.track?.name}
                className="object-fill aspect-square w-full rounded-md mt-6"
              />
            )}
            <header>
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
            </header>
            <span className="w-full flex flex-col gap-1">
              <Slider
                value={[currentTime]}
                max={duration || 180}
                min={0}
                onValueChange={(value: number[]) => {
                  const [newCurrentTime] = value;
                  if (audioElement?.current) {
                    audioElement.current.currentTime = newCurrentTime;
                  }
                }}
              />
              <span className="flex justify-between text-xs font-[rgba(var(--content))] opacity-80">
                <span>{formatTime(currentTime)}</span>
                <span>
                  {formatTime(duration) === "0:00"
                    ? "--:--"
                    : formatTime(duration)}
                </span>
              </span>
            </span>
            <footer className="flex w-full justify-evenly items-center ">
              <button
                onClick={handleShuffle}
                className="shuffle-button rounded-full active:bg-black/30 h-10 w-10 flex justify-center items-center"
              >
                <PiShuffleThin className="w-7 h-7" />
                <PiShuffleFill className="w-7 h-7 hidden" />
              </button>
              <button
                onClick={handlePrevious}
                className={
                  playlistManager?.hasPrevious
                    ? "rounded-full active:bg-black/30 h-12 w-12 flex justify-center items-center"
                    : "h-12 w-12 flex justify-center items-center"
                }
              >
                <BsSkipStartFill
                  className={
                    playlistManager?.hasPrevious
                      ? "w-10 h-10"
                      : "w-10 h-10 opacity-20"
                  }
                />
              </button>
              <button
                className="w-14 h-14 bg-[rgba(var(--content),1)] rounded-full text-[rgba(var(--bg),1)] flex items-center justify-center active:opacity-70"
                onClick={handlePlay}
              >
                {isPlaying ? (
                  <HiMiniPause className="w-8 h-8" />
                ) : (
                  <IoIosPlay className="w-8 h-8 ml-1" />
                )}
              </button>
              <button
                onClick={handleNext}
                className={
                  playlistManager?.hasNext
                    ? "rounded-full active:bg-black/30 h-12 w-12 flex justify-center items-center"
                    : "h-12 w-12 flex justify-center items-center"
                }
              >
                <BsSkipStartFill
                  className={
                    playlistManager?.hasNext
                      ? "rotate-180 w-10 h-10"
                      : "rotate-180 w-10 h-10 opacity-20"
                  }
                />
              </button>
              <button
                onClick={handleLoop}
                className="rounded-full active:bg-black/30 h-10 w-10 flex justify-center items-center"
              >
                {inLoop === "none" && <PiRepeatThin className="w-6 h-6" />}
                {inLoop === "all" && <PiRepeatBold className="w-6 h-6" />}
                {inLoop === "one" && <PiRepeatOnceBold className="w-6 h-6" />}
              </button>
            </footer>
          </article>
          <nav className="w-full h-24 flex items-center justify-around uppercase ">
            <a href="#playlist">siguientes</a>
          </nav>
        </section>
        <Playlist />
      </article>
    </section>
  );
}
