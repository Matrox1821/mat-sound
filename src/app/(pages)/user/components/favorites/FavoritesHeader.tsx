"use client";

import { useLikeStore } from "@/store/likeStore";
import { formatTime } from "@/shared/utils/helpers";
import { AsideButtons } from "./AsideButtons";

export function FavoritesHeader() {
  const tracksFromStore = useLikeStore((s) => s.likedTracks);
  const duration = tracksFromStore.reduce((acumulador, track) => {
    return acumulador + track.duration;
  }, 0);

  return (
    <header className="pr-14 py-8 bg-background flex flex-col uppercase">
      <h2 className="text-6xl font-black text-content-950">Canciones favoritas</h2>
      <div className="flex justify-between">
        <div className="flex gap-1">
          <span>{tracksFromStore.length} canciones</span>
          <span>•</span>
          <span>{formatTime(duration)} total</span>
        </div>
        <AsideButtons />
      </div>
    </header>
  );
}
