import { Fragment, useEffect, useRef } from "react";
import { IoPlay } from "react-icons/io5";
import { IoIosPause } from "react-icons/io";
import { rgbColor } from "../../shared/helpers";
import { usePlayerStore } from "../../store/playerStore";
import { CurrentTrack } from "./CurrentTrack";
import { ProgressBar } from "./ProgressBar";
import { PlayerScreen } from "./PlayerScreen";
import type { trackProps } from "src/types";
import { usePlayer } from "src/hooks/usePlayer";
function Background({
  image,
  isActive,
  children,
}: {
  image?: string;
  isActive: boolean;
  children: JSX.Element;
}) {
  const { color } = rgbColor(image);

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
  const { isPlaying, currentMusic, isActive } = usePlayerStore(
    (state) => state
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  const { handlePlay, openPlayerScreen } = usePlayer(audioRef);

  const { track, tracks } = currentMusic;

  return (
    <Fragment>
      <Background image={track?.image || ""} isActive={isActive}>
        <div onClick={openPlayerScreen} tabIndex={0} role="button">
          <div className="flex z-50 h-14 w-[calc(100vw-32px)] justify-between items-center p-2">
            <CurrentTrack />
            <div className="flex justify-center items-center">
              <span className="hidden">Vol</span>
              <button
                className="h-10 w-10 flex justify-center items-center rounded-full"
                onClick={handlePlay}
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
          {track && <ProgressBar audio={audioRef} />}
        </div>
      </Background>
      {track && <PlayerScreen audioElement={audioRef} />}
    </Fragment>
  );
}
