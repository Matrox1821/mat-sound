"use client";
import { use } from "react";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { TrackWithRecommendations } from "@shared-types/track.types";
import TrackTable from "@components/features/tables/TrackTable";

export default function SingleTrackTable({
  trackPromise,
  tracksPromise,
}: {
  trackPromise: Promise<TrackWithRecommendations[] | null>;
  tracksPromise: Promise<TrackWithRecommendations[] | null>;
}) {
  const pageTrack = use(trackPromise);
  const tracksData = use(tracksPromise);
  if (!pageTrack || !pageTrack[0] || !tracksData) return null;
  const track = pageTrack[0];
  const mainTrack = parseTrackByPlayer(track);
  const suggestedTracks = tracksData.map((t) => parseTrackByPlayer(t));
  return (
    <article className="w-full h-full relative p-8 flex flex-col gap-8 px-26 bg-background">
      {mainTrack.song ? (
        <section>
          <h2 className="text-background-400 text-xs font-bold uppercase mb-4">
            Reproduciendo ahora
          </h2>
          <TrackTable
            tracks={[mainTrack]}
            playingFromLabel={mainTrack.name}
            upcomingTracks={suggestedTracks}
          />
        </section>
      ) : (
        <section className="w-full flex justify-center">
          <span className="bg-amber-600/20 border border-amber-600/50 p-1 rounded-md text-amber-600 ">
            Canción no disponible: Es posible que la canción que buscas aún no haya sido publicada
          </span>
        </section>
      )}
    </article>
  );
}
