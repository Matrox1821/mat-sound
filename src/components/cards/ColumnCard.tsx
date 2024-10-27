import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../../store/playerStore";
import type { trackProps } from "../../types";
import { useProgress } from "src/hooks/usePogress";
import { formatTime, parseNumberListeners } from "src/shared/helpers";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";

export const prerender = false;
interface Props {
  track: trackProps;
  tracks?: trackProps[];
  isPlaylist?: boolean;
}

export function ColumnCard({ track, tracks, isPlaylist }: Props) {
  const {
    isPlaying,
    currentMusic,
    setIsPlaying,
    setCurrentMusic,
    setIsActive,
  } = usePlayerStore((state) => state);

  const isPlayingComponent = isPlaying && currentMusic.track?.id === track.id;

  const handleClick = () => {
    if (isPlayingComponent) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setCurrentMusic({ track, tracks });
    setIsActive(true);
  };

  return (
    <li
      className="w-full active:scale-[.98] rounded-lg"
      style={{
        backgroundColor: isPlayingComponent ? "rgba(255,255,255,.07)" : "",
      }}
    >
      <button
        className="flex gap-2 w-full h-full p-2 items-center"
        onClick={handleClick}
      >
        {track.image && !isPlaylist && (
          <img
            src={track.image}
            alt="yoasobi song"
            className="object-fill aspect-square w-12 rounded-sm"
          />
        )}
        {isPlaylist && (
          <span className="!w-12 h-12 flex items-center justify-center">
            {track.order_in_album}
          </span>
        )}
        <span className="flex flex-col items-start overflow-hidden text-start w-full">
          <h2
            style={{
              color: isPlayingComponent
                ? "rgba(var(--accent),1)"
                : "rgba(var(--content),1)",
              fontSize: `${isPlaylist ? "1rem" : ""}`,
              fontWeight: `${isPlaylist ? "500" : ""}`,
              overflowWrap: "anywhere",
            }}
            className="font-normal text-xl m-0 leading-5 overflow-hidden text-ellipsis w-full text-nowrap"
          >
            {track.name}
          </h2>
          <span className="text-xs font-base opacity-50">
            {!isPlaylist &&
              track.album?.name &&
              `${track.artist?.name} • ${track.album.name}`}
            {isPlaylist
              ? `${track.artist?.name} • ${formatTime(
                  track.seconds
                )} • ${parseNumberListeners(
                  track.reproductions
                )} reproducciones`
              : track.artist?.name}
          </span>
        </span>
        <span className="w-12 h-12 flex justify-center items-center">
          <HiOutlineEllipsisVertical className="color-white w-7 h-7" />
        </span>
      </button>
    </li>
  );
}
