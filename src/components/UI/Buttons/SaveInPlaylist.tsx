import { useOptimistic, useTransition } from "react";
import { Bookmark } from "../icons/Bookmark";
import { usePlayerStore } from "@/store/playerStore";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { togglePlaylist } from "@/actions/user";
import { usePathname } from "next/navigation";

export const SaveInPlaylist = ({
  playlistName,
  playlistId,
  trackId,
  initialIsSaved,
}: {
  playlistName: string;
  playlistId: string;
  trackId: string;
  initialIsSaved: boolean;
}) => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const updateTrackInStore = usePlayerStore((state) => state.updateTrackMetadata);
  const { error: toastError, message } = useToast();
  const [optimisticSaved, addOptimisticSaved] = useOptimistic(
    initialIsSaved,
    (newIsSaved: boolean) => newIsSaved
  );
  const handleLike = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    startTransition(async () => {
      const nextState = !optimisticSaved;
      addOptimisticSaved(nextState);
      updateTrackInStore(trackId, { isLiked: nextState });
      try {
        await togglePlaylist(playlistId, trackId, nextState, pathname);
        message(`${nextState ? "Agregado a" : "Eliminado de"} ${playlistName}`);
      } catch {
        toastError("No tienes una sesión iniciada.");
        updateTrackInStore(trackId, { isLiked: !nextState });
      }
    });
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`like-button cursor-pointer active:scale-110 flex items-center justify-center gap-2 bottom-2 left-2 rounded-full  transition-all hover:opacity-75 ${
        optimisticSaved ? "text-accent-950" : "text-content-900"
      }`}
    >
      <Bookmark isFilled={optimisticSaved} className="!h-7 !w-7" />
    </button>
  );
};
