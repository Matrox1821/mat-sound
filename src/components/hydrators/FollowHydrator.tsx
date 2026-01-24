"use client";

import { useFollowStore } from "@/store/followStore";
import { use, useEffect } from "react";

export function FollowHydrator({ artistFolloingIds }: { artistFolloingIds: Promise<string[]> }) {
  const following = use(artistFolloingIds);
  const hydrate = useFollowStore((s) => s.hydrate);

  useEffect(() => {
    hydrate(following);
  }, [hydrate, following]);

  return null;
}
