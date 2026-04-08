import { PlaylistFormData } from "@/types/playlist.types";

export const toUpdatePlaylistFormData = (data: PlaylistFormData) => {
  const form = new FormData();
  if (data.id) form.append("id", data.id);

  if (data.cover) form.append("cover", data.cover);
  form.append("name", data.name);

  return form;
};

export function parseUpdatedPlaylistFormData(formData: FormData): PlaylistFormData {
  return {
    id: formData.get("id") as string,
    cover: formData.get("cover") as File | null,
    name: formData.get("name") as string,
  };
}
