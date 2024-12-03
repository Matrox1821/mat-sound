import { useState } from "react";
import { usePlayerStore } from "../../store/playerStore";
import type { trackProps } from "../../types";
import { formatTime, parseNumberListeners } from "src/shared/helpers";

export const prerender = false;

interface Props {
  track: trackProps;
  tracks?: trackProps[];
  playlist?: trackProps[];
  nextTracks?: trackProps[];
  isPlaylist?: boolean;
  isPlaylistScreen?: boolean;
}

export function ColumnCard({
  track,
  tracks,
  isPlaylist,
  nextTracks,
  isPlaylistScreen = false,
}: Props) {
  const {
    isPlaying,
    currentMusic,
    setIsPlaying,
    setCurrentMusic,
    setIsActive,
  } = usePlayerStore((state) => state);

  const [isOpen, setIsOpen] = useState(false);

  const isPlayingComponent = isPlaying && currentMusic.track?.id === track.id;

  const handleClick = () => {
    if (isPlayingComponent) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setCurrentMusic({
      track,
      tracks,
      nextTracks,
      playlist:
        tracks && nextTracks
          ? tracks.concat(nextTracks)
          : tracks
          ? tracks
          : [track],
    });
    setIsActive(true);
  };

  const trackIsSelected = currentMusic.track?.id === track.id;

  return (
    <li
      className="w-full active:scale-[.98] rounded-lg"
      style={{
        backgroundColor:
          isPlaylistScreen && trackIsSelected
            ? "rgba(0,0,0,0.4)"
            : isPlayingComponent
            ? "rgba(255,255,255,.07)"
            : "transparent",
      }}
    >
      <button
        className="flex gap-2 w-full h-full p-2 items-center rounded-lg"
        onClick={handleClick}
      >
        {track.image && !isPlaylist && (
          <img
            src={track.image}
            alt={track.name}
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
              color:
                isPlaylistScreen && trackIsSelected
                  ? "#667dff"
                  : isPlayingComponent
                  ? "rgba(var(--accent),1)"
                  : "rgba(var(--content),1)",
              fontSize: `${isPlaylist ? "1rem" : ""}`,
              fontWeight: `${
                isPlaylistScreen && trackIsSelected
                  ? "700"
                  : isPlaylist
                  ? "500"
                  : ""
              }`,
              overflowWrap: "anywhere",
            }}
            className="font-normal text-xl m-0 leading-7 overflow-hidden text-ellipsis w-full text-nowrap"
          >
            {track.name}
          </h2>
          <span
            className="text-xs font-base opacity-50"
            style={{
              opacity: isPlaylistScreen && trackIsSelected ? 1 : 50,
            }}
          >
            {!isPlaylist &&
              `${track.artist?.name}${
                isPlaylistScreen ? "" : " • " + track.album?.name
              }`}
            {isPlaylist &&
              `${track.artist?.name} • ${formatTime(
                track.seconds
              )} • ${parseNumberListeners(track.reproductions)} reproducciones`}
          </span>
        </span>
      </button>
    </li>
  );
}
