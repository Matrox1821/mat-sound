import { usePlayerStore } from "../../store/playerStore";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState, type RefObject } from "react";
import { Slider } from "../Slider";
import { RgbColor } from "../../shared/helpers";
import { BsSkipStartFill } from "react-icons/bs";
import { IoIosPlay } from "react-icons/io";
import { HiMiniPause } from "react-icons/hi2";

interface Props {
  audioElement?: RefObject<HTMLAudioElement>;
}

export function PlayerScreen({ audioElement }: Props) {
  const {
    currentMusic,
    setCurrentMusic,
    playerScreenIsOpen,
    setPlayerScreenIsOpen,
    setIsPlaying,
    isPlaying,
  } = usePlayerStore((state) => state);

  const { color, accentColor } = RgbColor(currentMusic.track?.image);

  const [currentTime, setCurrentTime] = useState(0);

  const [playlistManager, setPlaylistManager] = useState<{
    hasPrevious: boolean;
    hasNext: boolean;
  }>();
  /* console.log(playlistManager); */
  useEffect(() => {
    if (audioElement && audioElement.current) {
      audioElement.current.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audioElement.current?.removeEventListener(
          "timeupdate",
          handleTimeUpdate
        );
      };
    }
  }, [currentTime]);

  useEffect(() => {
    if (currentMusic.track) {
      const indexTrack = currentMusic.tracks?.findIndex(
        (track) => track.id === currentMusic.track?.id
      );
      if (!indexTrack) return;
      setPlaylistManager({
        hasPrevious: indexTrack !== 0,
        hasNext: !!(
          indexTrack &&
          currentMusic.tracks &&
          indexTrack + 1 < currentMusic.tracks.length
        ),
      });
    }
  }, [currentMusic.track]);

  const handlePreviousNext = (type: "previous" | "next") => {
    if (currentMusic.track) {
      const indexTrack = currentMusic.tracks?.findIndex(
        (track) => track.id === currentMusic.track?.id
      );

      if (type === "previous" && playlistManager?.hasPrevious) {
        const { track, ...rest } = currentMusic;
        setCurrentMusic({
          track: rest.tracks![indexTrack ? indexTrack - 1 : 0],
          ...rest,
        });
        setIsPlaying(true);
        return;
      }

      if (type === "next" && playlistManager?.hasNext) {
        const { track, ...rest } = currentMusic;
        setCurrentMusic({
          track: rest.tracks![indexTrack ? indexTrack + 1 : 0],
          ...rest,
        });
        setIsPlaying(true);
        return;
      }
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(
      audioElement?.current ? audioElement.current.currentTime : 0
    );
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const duration = audioElement?.current?.duration;

  const formatTime = (time: number | undefined) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes ?? "0"}:${seconds ?? "00"}`;
  };

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
              {currentMusic.track?.album && currentMusic.track?.artist
                ? `${currentMusic.track?.artist.name} - ${currentMusic.track?.album.name}`
                : currentMusic.track?.artist?.name}
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
            <button onClick={() => handlePreviousNext("previous")}>
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
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <HiMiniPause className="w-8 h-8" />
              ) : (
                <IoIosPlay className="w-8 h-8 ml-1" />
              )}
            </button>
            <button onClick={() => handlePreviousNext("next")}>
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
