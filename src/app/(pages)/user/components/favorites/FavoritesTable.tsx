"use client";
import { useEffect, useState } from "react";
import { TrackTable } from "@components/features/tables/TrackTable";
import { useLikeStore } from "@/store/likeStore";
import { getUpcomingTracksAction } from "@/actions/user/like";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { playerTrackProps } from "@/types/track.types";

export function FavoritesTable() {
  const tracksFromStore = useLikeStore((s) => s.likedTracks);
  const [upcoming, setUpcoming] = useState<playerTrackProps[] | null>([]);

  useEffect(() => {
    async function loadRecommendations() {
      const idsToExclude = tracksFromStore.map((t) => t.id);

      // Llamada directa a la acción de servidor
      const result = await getUpcomingTracksAction(idsToExclude);

      if (result.success) {
        setUpcoming(result.data ? result.data.map((track) => parseTrackByPlayer(track)) : null);
      }
    }

    if (tracksFromStore.length > 0) {
      loadRecommendations();
    }
  }, [tracksFromStore]);

  return (
    <article className="pr-14 py-8 bg-background">
      <TrackTable
        tracks={tracksFromStore}
        showCover
        playingFromLabel="Favoritos"
        upcomingTracks={upcoming}
        playingFromHref={`user/favorites`}
      />
    </article>
  );
}
