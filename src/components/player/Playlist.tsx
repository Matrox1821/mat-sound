import { ColumnCard } from "@components/cards/ColumnCard";
import { usePlayerStore } from "src/store/playerStore";
import type { trackProps } from "src/types";

export function Playlist() {
  const { currentMusic } = usePlayerStore((state) => state);
  const { tracks, nextTracks, playlist } = currentMusic;
  return (
    <section className="flex flex-col w-full" id="playlist">
      <ul className="flex flex-col">
        {tracks?.map((track) => (
          <ColumnCard
            track={track}
            key={`playlist-${track.id}`}
            nextTracks={nextTracks}
            playlist={playlist}
            tracks={tracks}
          />
        ))}
      </ul>
      <ul className="flex flex-col">
        {nextTracks?.map((track) => (
          <ColumnCard
            track={track}
            key={`playlist-${track.id}`}
            nextTracks={nextTracks}
            playlist={playlist}
            tracks={tracks}
          />
        ))}
      </ul>
    </section>
  );
}
