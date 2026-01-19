"use client";
import { use } from "react";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { trackPageProps } from "@/types/common.types";
import TrackTable from "@/components/ui/tables/TrackTable";

export default function SingleTrackTable({
  trackPromise,
  tracksPromise,
}: {
  trackPromise: Promise<trackPageProps | null>;
  tracksPromise: Promise<trackPageProps[] | null>;
}) {
  const trackData = use(trackPromise);
  const tracksData = use(tracksPromise);

  if (!trackData || !tracksData) return null;
  const mainTrack = parseTrackByPlayer(trackData);
  const suggestedTracks = tracksData.map((t) => parseTrackByPlayer(t));
  return (
    <article className="w-full h-full relative p-8 flex flex-col gap-8 px-26 bg-background">
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
    </article>
  );
}
