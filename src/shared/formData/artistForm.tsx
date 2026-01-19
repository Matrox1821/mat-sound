import { ArtistFormData } from "@/types/form.types";

export const initialArtistFormData: ArtistFormData = {
  name: "",
  avatar: null,
  mainCover: null,
  listeners: 0,
  followers: 0,
  description: "",
  isVerified: false,
  regionalListeners: {},
  socials: {},
  covers: null,
};

//CREATE FORM

export const toArtistFormData = (data: ArtistFormData): FormData => {
  const form = new FormData();

  form.append("name", data.name);
  form.append("listeners", data.listeners.toString());
  form.append("followers", data.followers.toString());
  form.append("description", data.description);
  form.append("isVerified", data.isVerified.toString());
  form.append("regionalListeners", JSON.stringify(data.regionalListeners));
  form.append("socials", JSON.stringify(data.socials));

  if (data.avatar) form.append("avatar", data.avatar);
  if (data.mainCover) form.append("mainCover", data.mainCover);
  if (data.covers) data.covers.forEach((file) => form.append("covers", file));

  return form;
};
export function parseArtistFormData(formData: FormData): ArtistFormData {
  const parseJSON = <T,>(value: FormDataEntryValue | null): T => {
    if (!value) return {} as T;
    return JSON.parse(value.toString());
  };

  const getFiles = (formData: FormData, key: string): File[] => {
    const files: File[] = [];
    for (const [formKey, value] of formData.entries()) {
      if (formKey === key && value instanceof File) files.push(value);
    }
    return files;
  };

  return {
    name: formData.get("name") as string,
    avatar: formData.get("avatar") as File | null,
    mainCover: formData.get("mainCover") as File | null,
    listeners: Number(formData.get("listeners")),
    followers: Number(formData.get("followers")),
    description: formData.get("description") as string,
    isVerified: formData.get("isVerified") === "true",
    regionalListeners: parseJSON<Record<string, string>>(formData.get("regionalListeners")),
    socials: parseJSON<Record<string, string>>(formData.get("socials")),
    covers: getFiles(formData, "covers"),
  };
}

//UPDATE FORM


export const toUpdateArtistFormData = (data: ArtistFormData): FormData => {
  const form = new FormData();
  if (data.id) form.append("id", data.id);
  form.append("name", data.name);
  form.append("listeners", data.listeners.toString());
  form.append("followers", data.followers.toString());
  form.append("description", data.description);
  form.append("isVerified", data.isVerified.toString());
  form.append("regionalListeners", JSON.stringify(data.regionalListeners));
  form.append("socials", JSON.stringify(data.socials));

  if (data.avatar) form.append("avatar", data.avatar);
  if (data.mainCover) form.append("mainCover", data.mainCover);
  if (data.covers) data.covers.forEach((file) => form.append("covers", file));

  return form;
};

export function parseUpdateArtistFormData(formData: FormData): ArtistFormData {
  const parseJSON = <T,>(value: FormDataEntryValue | null): T => {
    if (!value) return {} as T;
    return JSON.parse(value.toString());
  };

  const getFiles = (formData: FormData, key: string): File[] => {
    const files: File[] = [];
    for (const [formKey, value] of formData.entries()) {
      if (formKey === key && value instanceof File) files.push(value);
    }
    return files;
  };

  return {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    avatar: formData.get("avatar") as File | null,
    mainCover: formData.get("mainCover") as File | null,
    listeners: Number(formData.get("listeners")),
    followers: Number(formData.get("followers")),
    description: formData.get("description") as string,
    isVerified: formData.get("isVerified") === "true",
    regionalListeners: parseJSON<Record<string, string>>(formData.get("regionalListeners")),
    socials: parseJSON<Record<string, string>>(formData.get("socials")),
    covers: getFiles(formData, "covers"),
  };
}