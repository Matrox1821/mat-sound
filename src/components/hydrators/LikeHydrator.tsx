"use client";

import { useLikeStore } from "@/store/likeStore";
import { playerTrackProps } from "@/types/track.types";
import { use, useEffect } from "react";

export function LikeHydrator({ likedTracks }: { likedTracks: Promise<playerTrackProps[]> }) {
  const likes = use(likedTracks);
  const hydrate = useLikeStore((s) => s.hydrate);

  useEffect(() => {
    hydrate(likes);
  }, [hydrate, likes]);

  return null;
}
