import { usePlayerStore } from "../store/playerStore";
import type { ArtistTracks } from "../shared/types";

interface Props {
  track: ArtistTracks;
  playlist?: ArtistTracks[];
}

export function PlaylistTrack({ track, playlist }: Props) {
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
    fetch(`/api/get-info-track/${track.id}.json`)
      .then((res) => res.json())
      .then((data) => {
        const { track: trackData } = data;
        setIsPlaying(true);
        setCurrentMusic({ track: trackData });
        setIsActive(true);
      });
  };

  return (
    <li className="w-full h-12 active:scale-[.98]">
      <button className="flex gap-2" onClick={handleClick}>
        {track.image && (
          <img
            src={track.image}
            alt="yoasobi song"
            className="object-fill aspect-square w-12 rounded-sm"
          />
        )}
        <div className="flex flex-col items-start">
          <h2
            style={{
              color: isPlayingComponent
                ? "rgba(var(--accent),1)"
                : "rgba(var(--content),1)",
            }}
            className="font-normal text-xl m-0 leading-5"
          >
            {track.name}
          </h2>
          <span className="text-xs font-medium opacity-70">
            {track.album ? `${track.artist} - ${track.album}` : track.artist}
          </span>
        </div>
      </button>
    </li>
  );
}
