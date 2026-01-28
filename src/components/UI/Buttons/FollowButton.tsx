"use client";

import { useTransition } from "react";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { toggleFollow as toggleFollowAction } from "@/actions/user";
import { useFollowStore } from "@/store/followStore";

interface FollowButtonProps {
  artistId: string;
}

export function FollowButton({ artistId }: FollowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { error: toastError } = useToast();

  const hydrated = useFollowStore((s) => s.hydrated);
  const isFollowing = useFollowStore((s) => s.isFolloging(artistId));
  const toggleFollow = useFollowStore((s) => s.toggleFollow);

  if (!hydrated) {
    return <button className="like-button h-5 w-5 opacity-0 pointer-events-none" aria-hidden />;
  }
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    startTransition(async () => {
      // optimistic
      toggleFollow(artistId);

      try {
        await toggleFollowAction(artistId);
      } catch {
        toastError("No tienes una sesión iniciada.");
        // rollback
        toggleFollow(artistId);
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`rounded-full h-8 px-6 cursor-pointer border text-sm font-semibold transition-colors ${isFollowing ? "border-content-950 bg-content-950 text-black" : "border-content-950 text-content-950 hover:text-content-950/70 hover:border-content-950/70 "}`}
    >
      {/* <button
        className={`like-button cursor-pointer active:scale-110 flex items-center justify-center gap-2 bottom-2 left-2 rounded-full h-2 w-5 transition-all hover:opacity-75  ${
          isLiked ? "text-accent-950" : "text-content-900"
        }`}
      >
        <Heart isFilled={isLiked} className="h-5" />
      </button> */}
      {isFollowing ? "Siguiendo" : "Seguir"}
    </button>
  );
}
