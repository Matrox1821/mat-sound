"use client";

import { getUpcomingTracksAction } from "@/actions/user/like";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { usePlayerStore } from "@/store/playerStore";
import { TrackById } from "@/types/track.types";
import { useEffect } from "react";

export function InitPlayerHydrator() {
  const setFetchUpcoming = usePlayerStore((s) => s.setFetchUpcoming);

  useEffect(() => {
    setFetchUpcoming(async () => {
      const store = usePlayerStore.getState();
      const result = await getUpcomingTracksAction([...store.trackCache.keys()]);
      if (!result.success || !result.data) return [];
      const tracks = await Promise.all(result.data);
      return tracks.filter((t): t is TrackById => t !== null).map((t) => parseTrackByPlayer(t));
    });
  }, []);
  return null;
}
