"use client";
import { Play } from "./Play";
import { Random } from "./Random";
import { useLikeStore } from "@/store/likeStore";

export function AsideButtons() {
  const tracksFromStore = useLikeStore((s) => s.likedTracks);

  return (
    <div className="flex gap-4 items-center">
      <Play tracksList={tracksFromStore} currently={tracksFromStore[0]} />
      <Random tracksList={tracksFromStore} />
    </div>
  );
}
