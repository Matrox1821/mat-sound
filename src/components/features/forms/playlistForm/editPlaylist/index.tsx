"use client";
import { useCallback, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";
import { CustomInputAdminForm } from "@components/features/inputs/CustomInputAdminForm";
import { InputCover } from "@/components/features/inputs/InputCover";
import { PlaylistFormData, PlaylistService } from "@/types/playlist.types";
import { toUpdatePlaylistFormData } from "@/shared/formData/playlistForm";
import { updatePlaylistServer } from "@/actions/playlist";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { deletePlaylist } from "@/actions/user/playlist";
import { GET_URL } from "@/shared/utils/constants";
import { usePlaylistStore } from "@/store/playlistStore";
import { useCollectionStore } from "@/store/collectionStore";

export const mapPlaylistToEditFormData = (playlist: PlaylistService): PlaylistFormData => {
  return {
    id: playlist.id,
    cover: null,
    name: playlist.name || "",
  };
};

export function EditPlaylistForm({ playlist }: { playlist: PlaylistService }) {
  const parsedPlaylist = mapPlaylistToEditFormData(playlist);
  const [formData, setFormData] = useState<PlaylistFormData>(parsedPlaylist);
  const [isCropping, setIsCropping] = useState(false);
  const { message, error } = useToast();
  const playlistStore = usePlaylistStore();
  const collectionStore = useCollectionStore();
  const { createEntity, success } = useCreateEntity({
    toFormData: toUpdatePlaylistFormData,
    serverAction: updatePlaylistServer,
    successMessage: "Playlist editada con éxito",
    errorMessage: "Ocurrió un error al editar la playlist",
  });
  const handleChange = useCallback(
    <K extends keyof PlaylistFormData>(field: K, value: PlaylistFormData[K]) => {
      setFormData((prev) => {
        // 2. Solo actualizar si el valor es realmente distinto para evitar renders extra
        if (JSON.stringify(prev[field]) === JSON.stringify(value)) return prev;
        return { ...prev, [field]: value };
      });
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEntity(formData);
  };

  useEffect(() => {
    if (success) {
      redirect(`/playlists/${playlist.id}`);
    }
  }, [success, playlist]);

  const handleDelete = async ({ id, name }: { id: string; name: string }) => {
    try {
      await deletePlaylist(id);
      message(`Playlist [ ${name} ] eliminado.`);
      playlistStore.removePlaylist(id);
      collectionStore.removePlaylist(id);
    } catch {
      error(`Error al eliminar [ ${name} ]`);
      return;
    }
    redirect(GET_URL + "/");
  };

  const confirm = async ({ event, id, name }: { event: any; id: string; name: string }) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Quieres eliminar este album?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete({ id, name }),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-[400px] flex flex-col gap-4 text-xs overflow-auto m-4 `}
      noValidate
    >
      <article className="flex flex-col text-sm gap-6">
        <InputCover
          onChange={(val: any) => handleChange("cover", val)}
          defaultImage={playlist.cover ? `${playlist.cover.sm}?t=${playlist.updatedAt}` : null}
          setIsCropping={setIsCropping}
          isCropping={isCropping}
          inputName="playlistCover"
          title="Editar portada de la playlist"
        />
        <CustomInputAdminForm
          title="Nombre:"
          name="name"
          type="text"
          value={formData.name}
          onChange={(val: any) => handleChange("name", val)}
          isRequired
          cssStyles={{ display: isCropping ? "none" : "flex" }}
        />
        <div
          className="flex pt-4 gap-4 w-full justify-end"
          style={{ display: isCropping ? "none" : "flex" }}
        >
          <div>
            <ConfirmPopup />
            <button
              type="button"
              className="p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-500/10 font-semibold"
              onClick={(event: any) => confirm({ event, id: playlist.id, name: playlist.name })}
            >
              Borrar Playlist
            </button>
          </div>
          <button
            className="bg-accent-950/20 border border-accent-950/50 p-4 text-white hover:bg-accent-950/25 cursor-pointer font-semibold rounded-md"
            type="submit"
          >
            Guardar Cambios
          </button>
        </div>
      </article>
    </form>
  );
}
