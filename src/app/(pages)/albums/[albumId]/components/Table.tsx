"use client";
import TrackTable from "@/components/UI/Tables/TrackTable";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { albumPageProps } from "@/types";
import { use } from "react";

export default function AlbumTable({
  albumPromise,
}: {
  albumPromise: Promise<albumPageProps | null>;
}) {
  const album = use(albumPromise);
  if (!album) return null;

  let disks: any[] = [];
  if (album.tracks) disks = [...new Set(album.tracks.map((t) => t.disk))].sort((a, b) => a - b);

  return (
    <article className="px-26 py-8 bg-background">
      {disks.map((diskNum) => {
        const diskTracks = album.tracks
          ?.filter((t) => t.disk === diskNum)
          .map((t) => parseTrackByPlayer(t));

        return (
          <section key={diskNum} className="mb-8">
            {disks.length > 1 && <h2 className="text-xl font-bold mb-4">Volumen {diskNum}</h2>}
            <TrackTable tracks={diskTracks} playingFromLabel={album.name} isAlbumView />
          </section>
        );
      })}
    </article>
  );
}
