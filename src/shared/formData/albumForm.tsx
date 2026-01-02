import { AlbumFormData } from "@/types/apiTypes";

export const initialAlbumFormData: AlbumFormData = {
  name: "",
  cover: null,
  release_date: "",
  artists: [],
  tracks_order: {},
  tracks: [],
};

export const toAlbumFormData = (data: AlbumFormData): FormData => {
  const form = new FormData();

  form.append("name", data.name);
  form.append("release_date", data.release_date.toString());
  form.append("tracks_order", JSON.stringify(data.tracks_order));

  if (data.cover) form.append("cover", data.cover);

  if (data.artists) {
    data.artists.forEach((id) => {
      form.append("artists", id);
    });
  }
  if (data.tracks) {
    data.tracks.forEach((id) => {
      form.append("tracks", id);
    });
  }

  return form;
};

/*  const body = {
   name: formData.get("name") as string,
   image: formData.get("image") as File,
   release_date: formData.get("release_date") as string,
   tracks_in_order:   JSON.parse(formData.get("tracks_in_order") as string) as {
        [key: string]: string;
      }[], ,
   artists,
 };
 */
export function parseAlbumFormData(formData: FormData): AlbumFormData {
  const parseJSON = <T,>(value: FormDataEntryValue | null): T => {
    if (!value) return {} as T;
    return JSON.parse(value.toString());
  };

  return {
    name: formData.get("name") as string,
    cover: formData.get("cover") as File | null,
    artists: formData.getAll("artists") as string[],
    tracks_order: parseJSON<Record<string, string>>(formData.get("tracks_order")),
    release_date: formData.get("release_date") as string,
    tracks: formData.getAll("tracks") as string[],
  };
}
