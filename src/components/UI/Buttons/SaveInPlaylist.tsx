import { useTransition } from "react";
import { Bookmark } from "../icons/Bookmark";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { togglePlaylist } from "@/actions/user";
import { usePlaylistStore } from "@/store/playlistStore";
import { ImageSizes } from "@/types/common.types";

export const SaveInPlaylist = ({
  playlistName,
  playlistId,
  track,
}: {
  playlistName: string;
  playlistId: string;
  track: { id: string; cover: ImageSizes };
}) => {
  const [isPending, startTransition] = useTransition();
  const { error: toastError, message } = useToast();

  const hydrated = usePlaylistStore((s) => s.hydrated);
  const isTrackInPlaylist = usePlaylistStore((s) => s.isTrackInPlaylist(playlistId, track.id));
  const toggleTrackInPlaylist = usePlaylistStore((s) => s.toggleTrackInPlaylist);

  const handleSave = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    startTransition(async () => {
      toggleTrackInPlaylist(playlistId, track);
      try {
        await togglePlaylist(playlistId, track.id);
        message(`${isTrackInPlaylist ? "Eliminado de" : "Agregado a"} ${playlistName}`);
      } catch {
        toastError("No tienes una sesión iniciada.");
        toggleTrackInPlaylist(playlistId, track);
      }
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
      className={`like-button cursor-pointer active:scale-110 flex items-center justify-center gap-2 bottom-2 left-2 rounded-full  transition-all hover:opacity-75 ${
        isTrackInPlaylist ? "text-accent-950" : "text-content-900"
      }`}
    >
      {hydrated ? (
        <Bookmark isFilled={isTrackInPlaylist} className="!h-7 !w-7" />
      ) : (
        <Bookmark isFilled={false} className="!h-7 !w-7" />
      )}
    </button>
  );
};
