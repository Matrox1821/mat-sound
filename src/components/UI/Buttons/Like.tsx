"use client";

import { toggleLikeAction } from "@/actions/like";
import { useOptimistic, useTransition } from "react";
import { Heart } from "../Icons/Heart";
import { usePlayerStore } from "@/store/playerStore";

interface LikeButtonProps {
  trackId: string;
  initialIsLiked: boolean;
  initialCount: number;
}

export function LikeButton({ trackId, initialIsLiked, initialCount }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const updateTrackInStore = usePlayerStore((state) => state.updateTrackMetadata);
  // 1. Definimos el estado optimista
  // Recibe el estado real y una función para calcular el estado temporal
  const [optimisticLike, addOptimisticLike] = useOptimistic(
    { isLiked: initialIsLiked, count: initialCount },
    (state, newIsLiked: boolean) => ({
      isLiked: newIsLiked,
      count: newIsLiked ? state.count + 1 : state.count - 1,
    })
  );

  const handleLike = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    startTransition(async () => {
      const nextState = !optimisticLike.isLiked;
      addOptimisticLike(nextState);
      updateTrackInStore(trackId, { isLiked: nextState });
      try {
        await toggleLikeAction(trackId, nextState);
      } catch (error) {
        console.error("Error al guardar el like", error);
        updateTrackInStore(trackId, { isLiked: !nextState });
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`like-button cursor-pointer active:scale-110 flex items-center justify-center gap-2 bottom-2 left-2 rounded-full h-2 w-5 transition-all hover:opacity-75 ${
        optimisticLike.isLiked ? "text-accent-950" : "text-white"
      }`}
    >
      <Heart isFilled={optimisticLike.isLiked} className="h-5" />
    </button>
  );
}
