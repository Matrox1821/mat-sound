"use client";
import TrackTable from "@components/features/tables/TrackTable";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { AlbumById } from "@shared-types/album.types";
import { TrackById } from "@shared-types/track.types";
import { use } from "react";

export default function AlbumTable({
  albumPromise,
}: {
  albumPromise: Promise<{
    album: AlbumById;
    recommendedTracks: TrackById[];
  } | null>;
}) {
  const albumResponse = use(albumPromise);
  if (!albumResponse) return null;
  const { album, recommendedTracks } = albumResponse;
  let disks: any[] = [];
  if (album.tracks && album.tracks.length > 0)
    disks = [...new Set(album.tracks.map((t) => t.disk))].sort((a, b) => a - b);
  return (
    <article className="px-26 py-8 bg-background">
      {disks.length > 0 ? (
        disks.map((diskNum) => {
          const diskTracks = album.tracks
            ?.filter((t) => t.disk === diskNum)
            .map((t) => parseTrackByPlayer(t.track));

          return (
            <section key={diskNum} className="mb-8">
              {disks.length > 1 && <h2 className="text-xl font-bold mb-4">Volumen {diskNum}</h2>}
              {diskTracks ? (
                <TrackTable
                  tracks={diskTracks}
                  playingFromLabel={album.name}
                  upcomingTracks={
                    recommendedTracks && recommendedTracks.map((t) => parseTrackByPlayer(t))
                  }
                />
              ) : null}
            </section>
          );
        })
      ) : (
        <section className="w-full flex justify-center">
          <span className="bg-amber-600/20 border border-amber-600/50 p-1 rounded-md text-amber-600 ">
            Album no disponible: Es posible que el album que buscas aún no haya sido publicado
          </span>
        </section>
      )}
    </article>
  );
}
