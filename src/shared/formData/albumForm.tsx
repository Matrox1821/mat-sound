import { AlbumFormData } from "@/types/form.types";

export const initialAlbumFormData: AlbumFormData = {
  name: "",
  cover: null,
  releaseDate: "",
  artists: [],
  tracksOrder: {},
};

//CREATE FORM

export const toAlbumFormData = (data: AlbumFormData): FormData => {
  const form = new FormData();

  form.append("name", data.name);
  form.append("releaseDate", data.releaseDate.toString());
  form.append("tracksOrder", JSON.stringify(data.tracksOrder));

  if (data.cover) form.append("cover", data.cover);

  if (data.artists) {
    data.artists.forEach((id) => {
      form.append("artists", id);
    });
  }

  return form;
};

export function parseAlbumFormData(formData: FormData): AlbumFormData {
  const parseJSON = <T,>(value: FormDataEntryValue | null): T => {
    if (!value) return {} as T;
    return JSON.parse(value.toString());
  };

  return {
    name: formData.get("name") as string,
    cover: formData.get("cover") as File | null,
    artists: formData.getAll("artists") as string[],
    tracksOrder: parseJSON<Record<string, string>>(formData.get("tracksOrder")),
    releaseDate: formData.get("releaseDate") as string,
  };
}

//UPDATE FORM

export const toUpdateAlbumFormData = (data: AlbumFormData): FormData => {
  const form = new FormData();

  if (data.id) form.append("id", data.id);
  if (data.cover) form.append("cover", data.cover);

  form.append("name", data.name);
  form.append("releaseDate", data.releaseDate.toString());

  return form;
};

export function parseUpdatedAlbumFormData(formData: FormData): AlbumFormData {
  return {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    cover: formData.get("cover") as File | null,
    releaseDate: formData.get("releaseDate") as string,
  };
}
