"use client";

import { useLikeStore } from "@/store/likeStore";
import { use, useEffect } from "react";

export function LikeHydrator({ likedIds }: { likedIds: Promise<string[]> }) {
  const likes = use(likedIds);
  const hydrate = useLikeStore((s) => s.hydrate);

  useEffect(() => {
    hydrate(likes);
  }, [hydrate, likes]);

  return null;
}
