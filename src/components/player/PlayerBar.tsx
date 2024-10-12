import { Fragment, useEffect, useRef } from "react";
import { IoPlay } from "react-icons/io5";
import { IoIosPause } from "react-icons/io";
import { RgbColor } from "../../shared/helpers";
import { usePlayerStore } from "../../store/playerStore";
import { CurrentTrack } from "./CurrentTrack";
import { ProgressBar } from "./ProgressBar";
import { PlayerScreen } from "./PlayerScreen";
function Background({
  image,
  isActive,
  children,
}: {
  image?: string;
  isActive: boolean;
  children: JSX.Element;
}) {
  const { color } = RgbColor(image);

  return (
    <div
      style={{
        backgroundColor: `rgba(${color},1)`,
        display: isActive ? "flex" : "none",
      }}
      className="fixed bottom-16 mx-4 rounded-lg flex-col justify-center items-center z-50"
    >
      {children}
    </div>
  );
}

export function PlayerBar() {
  const {
    isPlaying,
    setIsPlaying,
    currentMusic,
    isActive,
    setPlayerScreenIsOpen,
  } = usePlayerStore((state) => state);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!currentMusic || !audioRef.current) return;
    const { type, track, tracks } = currentMusic;
    if (track) {
      audioRef.current.src = track.song_url;
      audioRef.current.volume = 0.1;
      audioRef.current.play();
    }
  }, [currentMusic]);

  useEffect(() => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsPlaying(!isPlaying);
  };

  const openPlayerScreen = () => {
    setPlayerScreenIsOpen(true);
  };

  if (!currentMusic.track) return;
  return (
    <Fragment>
      <Background image={currentMusic.track?.image || ""} isActive={isActive}>
        <div onClick={openPlayerScreen} tabIndex={0} role="button">
          <div className="flex z-50 h-14 w-[calc(100vw-32px)] justify-between items-center p-2">
            {currentMusic.track && (
              <CurrentTrack
                image={currentMusic.track.image || ""}
                title={currentMusic.track.name}
                artist={currentMusic.track.artist?.name || ""}
              />
            )}
            <div className="flex justify-center items-center">
              <span className="hidden">Vol</span>
              <button
                className="h-10 w-10 flex justify-center items-center rounded-full"
                onClick={handleClick}
              >
                {isPlaying ? (
                  <IoIosPause className="h-7 w-7 text-[rgba(var(--content),1)]" />
                ) : (
                  <IoPlay className="h-7 w-7 text-[rgba(var(--content),1)] ml-1" />
                )}
              </button>
            </div>
            <audio ref={audioRef} /* muted */ />
          </div>
          {currentMusic.track && <ProgressBar audio={audioRef} />}
        </div>
      </Background>
      {currentMusic.track && <PlayerScreen audioElement={audioRef} />}
    </Fragment>
  );
}
