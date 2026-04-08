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

  const playlist = {
    id: playlistData?.id,
    name: playlistData.name,
    cover: playlistData.cover,
    tracks: new Map(
      playlistData.tracks.map((track) => [
        track.id,
        {
          id: track.id,
          name: track.name,
          cover: track.cover,
          artists: new Map(track.artists.map(({ id, name, avatar }) => [id, { id, name, avatar }])),
        },
      ]),
    ),
  };

  const isSaved = isPlaylistInCollection(playlist.id);

  const handleSave = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    startTransition(async () => {
      togglePlaylistInCollection(playlist);
      try {
        await togglePlaylist(playlist);
        message(`${isSaved ? "Eliminado de la colección." : "Agregado a la colección."}`);
      } catch {
        toastError("No tienes una sesión iniciada.");
        togglePlaylistInCollection(playlist);
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
