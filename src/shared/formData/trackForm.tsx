import { TrackFormData } from "@/types/apiTypes";

export const initialTrackFormData: TrackFormData = {
  name: "",
  cover: null,
  song: null,
  release_date: "",
  duration: 0,
  reproductions: 0,
  genres: [],
  order_and_disk: {},
  artists: [],
  lyric: "",
};

export const toTrackFormData = (data: TrackFormData) => {
  const form = new FormData();

  form.append("name", data.name);
  form.append("release_date", data.release_date.toString());
  form.append("duration", data.duration.toString());
  form.append("reproductions", data.reproductions.toString());
  if (data.genres) {
    data.genres.forEach((id) => {
      form.append("genres", id);
    });
  }
  form.append("lyric", data.lyric);

  form.append("order_and_disk", JSON.stringify(data.order_and_disk));

  if (data.cover) form.append("cover", data.cover);
  if (data.song) form.append("song", data.song);

  if (data.artists) {
    data.artists.forEach((id) => {
      form.append("artists", id);
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
export function parseTrackFormData(formData: FormData): TrackFormData {
  const parseJSON = (value: FormDataEntryValue | null) => {
    if (!value) return {};
    return JSON.parse(value.toString());
  };

  return {
    name: formData.get("name") as string,
    cover: formData.get("cover") as File | null,
    artists: formData.getAll("artists") as string[],
    release_date: formData.get("release_date") as string,
    song: formData.get("song") as File | null,
    duration: Number(formData.get("duration")) | 0,
    reproductions: Number(formData.get("reproductions") as string) | 0,
    genres: formData.getAll("genres") as string[],
    order_and_disk: parseJSON(formData.get("order_and_disk")),
    lyric: formData.get("lyric") as string,
  };
}
