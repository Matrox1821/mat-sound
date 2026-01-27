"use client";

import { usePlaylistStore } from "@/store/playlistStore";
import { ImageSizes } from "@shared-types/common.types";
import { use, useEffect } from "react";

export function PlaylistsHydrator({
  playlists: playlistsPromise,
}: {
  playlists: Promise<
    {
      id: string;
      name: string;
      cover?: ImageSizes | null;
      tracks: { id: string; cover: ImageSizes }[];
    }[]
  >;
}) {
  const playlists = use(playlistsPromise);
  const hydrate = usePlaylistStore((s) => s.hydrate);

  useEffect(() => {
    hydrate(playlists);
  }, [hydrate, playlists]);

  return null;
}
