"use client";
import { useEffect, useState } from "react";
import { Play } from "./Play";
import { Random } from "./Random";
import { useLikeStore } from "@/store/likeStore";
import { playerTrackProps } from "@/types/track.types";
import { getUpcomingTracksAction } from "@/actions/user/like";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";

export function AsideButtons() {
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
    <div className="flex gap-4 items-center">
      <Play
        tracksList={tracksFromStore}
        currently={tracksFromStore[0]}
        upcoming={upcoming}
        playlistName={"likes"}
      />
      <Random tracksList={tracksFromStore} upcoming={upcoming} playlistName={"likes"} />
    </div>
  );
}
