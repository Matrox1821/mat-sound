import { ArtistFormData } from "@/types/apiTypes";

export const initialArtistFormData: ArtistFormData = {
  name: "",
  avatar: null,
  main_cover: null,
  listeners: 0,
  followers: 0,
  description: "",
  is_verified: false,
  regional_listeners: {},
  socials: {},
  covers: null,
};

export const toArtistFormData = (data: ArtistFormData): FormData => {
  const form = new FormData();

  form.append("name", data.name);
  form.append("listeners", data.listeners.toString());
  form.append("followers", data.followers.toString());
  form.append("description", data.description);
  form.append("is_verified", data.is_verified.toString());
  form.append("regional_listeners", JSON.stringify(data.regional_listeners));
  form.append("socials", JSON.stringify(data.socials));

  if (data.avatar) form.append("avatar", data.avatar);
  if (data.main_cover) form.append("main_cover", data.main_cover);
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
    main_cover: formData.get("main_cover") as File | null,
    listeners: Number(formData.get("listeners")),
    followers: Number(formData.get("followers")),
    description: formData.get("description") as string,
    is_verified: formData.get("is_verified") === "true",
    regional_listeners: parseJSON<Record<string, string>>(formData.get("regional_listeners")),
    socials: parseJSON<Record<string, string>>(formData.get("socials")),
    covers: getFiles(formData, "covers"),
  };
}
