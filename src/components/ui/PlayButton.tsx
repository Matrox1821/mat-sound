import { IoIosPlay } from "react-icons/io";

import { IoIosPause } from "react-icons/io";

import { usePlayerStore } from "../../store/playerStore";
import type { trackProps } from "../../types";

export function PlayButton({
  song,
  tracks,
  styleContainer,
  styleIcon,
}: {
  song: trackProps;
  tracks?: trackProps[];
  styleContainer?: string;
  styleIcon?: string;
}) {
  const {
    isPlaying,
    currentMusic,
    setIsPlaying,
    setCurrentMusic,
    setIsActive,
  } = usePlayerStore((state) => state);

  const isPlayingComponent = isPlaying && currentMusic.track?.id === song.id;
  const handleClick = () => {
    if (isPlayingComponent) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setCurrentMusic({ track: song, tracks: tracks || [] });
    setIsActive(true);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: "rgba(var(--accent),1)",
        borderRadius: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className={styleContainer || "w-10 h-10"}
    >
      {isPlayingComponent ? (
        <IoIosPause
          style={{
            color: "rgba(var(--bg),1)",
          }}
          className={styleIcon || "w-6 h-6"}
        />
      ) : (
        <IoIosPlay
          style={{
            color: "rgba(var(--bg),1)",
            marginLeft: "3px",
          }}
          className={styleIcon || "w-6 h-6"}
        />
      )}
    </button>
  );
}
