"use client";
import { TrackTable } from "@components/features/tables/TrackTable";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { playerTrackProps } from "@shared-types/track.types";

import { use } from "react";

export function FavoritesTable({
  tracksPromise,
}: {
  tracksPromise: Promise<playerTrackProps[] | null>;
}) {
  const tracksData = use(tracksPromise);

  if (!tracksData) return null;
  const tracks = tracksData.map((t) => parseTrackByPlayer(t));

  return (
    <article className="pr-14 py-8 bg-background">
      <TrackTable tracks={tracks} showCover playingFromLabel="Favoritos" />
    </article>
  );
}
