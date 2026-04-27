import { useTransition } from "react";
import { Bookmark } from "../icons/Bookmark";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { useCollectionStore } from "@/store/collectionStore";
import { AlbumById } from "@/types/album.types";
import { toggleAlbumInCollection } from "@/actions/user/collection";

export const SaveInCollection = ({ album }: { album: AlbumById }) => {
  const [isPending, startTransition] = useTransition();
  const { error: toastError, message } = useToast();

  const hydrated = useCollectionStore((s) => s.hydrated);

  const isAlbumInCollection = useCollectionStore((s) => s.isAlbumInCollection(album.id));

  const toggleAlbumInCollectionStore = useCollectionStore((s) => s.toggleAlbumInCollection);

  const handleSave = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    startTransition(async () => {
      toggleAlbumInCollectionStore(album);

      try {
        await toggleAlbumInCollection(album);
        message(
          `${isAlbumInCollection ? "Eliminado de la collección" : "Agregado a la collección"}`,
        );
      } catch {
        toastError("No tienes una sesión iniciada.");
        toggleAlbumInCollectionStore(album);
      }
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
      className={`like-button cursor-pointer active:scale-110 flex items-center justify-center gap-2 bottom-2 left-2 rounded-full  transition-all hover:opacity-75 ${
        hydrated && isAlbumInCollection ? "text-accent-950" : "text-content-900"
      }`}
    >
      {hydrated ? (
        <Bookmark isFilled={isAlbumInCollection} className="!h-7 !w-7" />
      ) : (
        <Bookmark isFilled={false} className="!h-7 !w-7" />
      )}
    </button>
  );
};
