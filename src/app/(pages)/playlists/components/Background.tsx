import { PlaylistImage } from "@/components/ui/images/PlaylistImage";
import { PlaylistService } from "@/types/playlist.types";
import { TrackById } from "@/types/track.types";
import { use } from "react";

export function Background({
  playlistPromise,
}: {
  playlistPromise: Promise<{ playlist: PlaylistService; recommendedTracks: TrackById[] | null }>;
}) {
  const playlistResponse = use(playlistPromise);
  const { playlist } = playlistResponse;
  return (
    <div className="w-full h-full absolute flex items-center justify-center">
      <div className="w-3/7 h-full absolute pt-32 flex flex-col items-center gap-8 -top-80">
        <figure className="relative w-full h-auto aspect-square select-none">
          <PlaylistImage
            image={playlist.cover && `${playlist.cover.sm}?t=${playlist.updatedAt}`}
            trackImages={playlist.coverListDefault}
            quality={75}
            className="!w-full !h-auto !aspect-square blur-[84px] brightness-50"
          />
        </figure>
      </div>
    </div>
  );
}
