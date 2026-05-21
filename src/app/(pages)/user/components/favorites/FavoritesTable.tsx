"use client";
import { TrackTable } from "@components/features/tables/TrackTable";
import { useLikeStore } from "@/store/likeStore";

export function FavoritesTable() {
  const tracksFromStore = useLikeStore((s) => s.likedTracks);

  return (
    <article className="pr-14 py-8 bg-background">
      <TrackTable
        tracks={tracksFromStore}
        showCover
        playingFrom={{ from: "Favoritos", href: `user/favorites` }}
      />
    </article>
  );
}
