"use client";
import { useCallback, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";
import { CustomInputAdminForm } from "@components/features/inputs/CustomInputAdminForm";
import { InputCover } from "@/components/features/inputs/InputCover";
import { PlaylistFormData, PlaylistService } from "@/types/playlist.types";
import { toUpdatePlaylistFormData } from "@/shared/formData/playlistForm";
import { updatePlaylistServer } from "@/actions/playlist";

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
