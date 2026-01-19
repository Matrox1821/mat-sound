import { TrackFormData } from "@/types/form.types";

export const initialTrackFormData: TrackFormData = {
  name: "",
  cover: null,
  song: null,
  releaseDate: "",
  duration: 0,
  reproductions: 0,
  genres: [],
  orderAndDisk: {},
  artists: [],
  lyrics: "",
};

//CREATE FORM


export const toTrackFormData = (data: TrackFormData) => {
  const form = new FormData();

  form.append("name", data.name);
  form.append("releaseDate", data.releaseDate.toString());
  form.append("duration", data.duration.toString());
  form.append("reproductions", data.reproductions.toString());
  if (data.genres) {
    data.genres.forEach((id) => {
      form.append("genres", id);
    });
  }
  form.append("lyrics", data.lyrics);

  form.append("orderAndDisk", JSON.stringify(data.orderAndDisk));

  if (data.cover) form.append("cover", data.cover);
  if (data.song) form.append("song", data.song);

  if (data.artists) {
    data.artists.forEach((id) => {
      form.append("artists", id);
    });
  }

  return form;
};

export function parseTrackFormData(formData: FormData): TrackFormData {
  const parseJSON = (value: FormDataEntryValue | null) => {
    if (!value) return {};
    return JSON.parse(value.toString());
  };

  return {
    name: formData.get("name") as string,
    cover: formData.get("cover") as File | null,
    artists: formData.getAll("artists") as string[],
    releaseDate: formData.get("releaseDate") as string,
    song: formData.get("song") as File | null,
    duration: Number(formData.get("duration")) | 0,
    reproductions: Number(formData.get("reproductions") as string) | 0,
    genres: formData.getAll("genres") as string[],
    orderAndDisk: parseJSON(formData.get("orderAndDisk")),
    lyrics: formData.get("lyrics") as string,
  };
}

//UPDATE

export const toUpdateTrackFormData = (data: TrackFormData) => {
  const form = new FormData();
  if (data.id) form.append("id", data.id);

  form.append("name", data.name);
  form.append("releaseDate", data.releaseDate.toString());
  form.append("duration", data.duration.toString());
  form.append("reproductions", data.reproductions.toString());
  if (data.genres) {
    data.genres.forEach((id) => {
      form.append("genres", id);
    });
  }
  form.append("lyrics", data.lyrics);

  form.append("orderAndDisk", JSON.stringify(data.orderAndDisk));

  if (data.cover) form.append("cover", data.cover);
  if (data.song) form.append("song", data.song);

  if (data.artists) {
    data.artists.forEach((id) => {
      form.append("artists", id);
    });
  }

  return form;
};

export function parseUpdatedTrackFormData(formData: FormData): TrackFormData {
  const parseJSON = (value: FormDataEntryValue | null) => {
    if (!value) return {};
    return JSON.parse(value.toString());
  };

  return {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    cover: formData.get("cover") as File | null,
    artists: formData.getAll("artists") as string[],
    releaseDate: formData.get("releaseDate") as string,
    song: formData.get("song") as File | null,
    duration: Number(formData.get("duration")) | 0,
    reproductions: Number(formData.get("reproductions") as string) | 0,
    genres: formData.getAll("genres") as string[],
    orderAndDisk: parseJSON(formData.get("orderAndDisk")),
    lyrics: formData.get("lyrics") as string,
  };
}
