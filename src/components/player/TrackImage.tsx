import { usePlayerStore } from "src/store/playerStore";
import type { trackProps } from "src/types";

export function TrackImage({
  track,
  tracks,
  nextTracks = [],
}: {
  track: trackProps;
  nextTracks?: trackProps[] | [];
  tracks?: trackProps[];
}) {
  const { setCurrentMusic, setIsPlaying, setPlayerScreenIsOpen, setIsActive } =
    usePlayerStore();
  const handleClick = () => {
    setCurrentMusic({
      track: track,
      tracks: tracks || [track],
      nextTracks,
      playlist:
        tracks && nextTracks
          ? tracks.concat(nextTracks)
          : tracks
          ? tracks
          : [track],
    });
    setIsPlaying(true);
    setIsActive(true);
    setPlayerScreenIsOpen(true);
    const main = document.querySelector("main");
    if (main) main.style.paddingBottom = "9rem";
  };

  return (
    <button
      className="h-[2.9rem] w-[2.1rem] rounded-[7px] flex justify-center items-center bg-[rgba(var(--bg),1)] image-button relative z-0 overflow-hidden"
      onClick={handleClick}
    >
      <span className="bg-[rgba(var(--bg),1)] p-[0.2rem] rounded-[5px] relative z-20">
        <img
          src={track.image}
          alt={track.name}
          className="h-9 w-6 object-cover rounded-[4px]"
        />
      </span>
    </button>
  );
}
