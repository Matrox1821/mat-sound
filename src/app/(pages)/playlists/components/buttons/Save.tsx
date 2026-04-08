import { Bookmark } from "@/components/ui/icons/Bookmark";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { useCollectionStore } from "@/store/collectionStore";
import { PlaylistService } from "@/types/playlist.types";
import { useTransition } from "react";
import { togglePlaylistInCollection as togglePlaylist } from "@/actions/user";
export function Save({ playlist: playlistData }: { playlist: PlaylistService | null }) {
  const { isPlaylistInCollection, hydrated, togglePlaylistInCollection } = useCollectionStore(
    (s) => s,
  );
  const [isPending, startTransition] = useTransition();
  const { error: toastError, message } = useToast();
  if (!playlistData) return;

  const isSaved = isPlaylistInCollection(playlistData.id);

  const handleSave = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    startTransition(async () => {
      togglePlaylistInCollection(playlistData);
      try {
        await togglePlaylist(playlistData);
        message(`${isSaved ? "Eliminado de la colección." : "Agregado a la colección."}`);
      } catch {
        toastError("No tienes una sesión iniciada.");
        togglePlaylistInCollection(playlistData);
      }
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
      className="!border-none !text-white cursor-pointer flex flex-col items-center justify-center gap-2 bg-background-100/20 w-10 h-10 rounded-full"
    >
      {hydrated ? (
        <Bookmark isFilled={isSaved} className="!h-5 !w-5" />
      ) : (
        <Bookmark isFilled={false} className="!h-5 !w-5" />
      )}
    </button>
  );
}
