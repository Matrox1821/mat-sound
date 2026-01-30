"use client";

import { useTransition } from "react";
import { Heart } from "../icons/Heart";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { toggleLike as toggleLikeAction } from "@/actions/user";
import { useLikeStore } from "@/store/likeStore";

interface LikeButtonProps {
  trackId: string;
}

export function LikeButton({ trackId }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { error: toastError } = useToast();

  const hydrated = useLikeStore((s) => s.hydrated);
  const isLiked = useLikeStore((s) => s.isLiked(trackId));
  const toggleLike = useLikeStore((s) => s.toggleLike);

  if (!hydrated) {
    return <button className="like-button h-5 w-5 opacity-0 pointer-events-none" aria-hidden />;
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    startTransition(async () => {
      // optimistic
      toggleLike(trackId);

      try {
        await toggleLikeAction(trackId);
      } catch {
        toastError("No tienes una sesión iniciada.");
        // rollback
        toggleLike(trackId);
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`like-button cursor-pointer active:scale-110 flex items-center justify-center gap-2 bottom-2 left-2 rounded-full h-2 w-5 transition-all hover:opacity-75  ${
        isLiked ? "text-accent-950" : "text-content-900"
      }`}
    >
      <Heart isFilled={isLiked} className="h-5" />
    </button>
  );
}
