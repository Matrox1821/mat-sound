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
            isPlaylistScreen
          />
        ))}
      </ul>
      {nextTracks && nextTracks?.length > 0 && (
        <>
          <h3 className="h-7 flex items-center  border-y-[1px] border-black/30 bg-black/10 p-2 text-sm my-4">
            Playlist automática
          </h3>
          <ul className="flex flex-col">
            {nextTracks?.map((track) => (
              <ColumnCard
                track={track}
                key={`playlist-${track.id}`}
                nextTracks={nextTracks}
                playlist={playlist}
                tracks={tracks}
                isPlaylistScreen
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
