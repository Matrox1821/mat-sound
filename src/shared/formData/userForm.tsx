import { UserFormData } from "@shared-types/form.types";

export const toUpdateUserFormData = (data: UserFormData) => {
  const form = new FormData();
  if (data.id) form.append("id", data.id);

  form.append("displayUsername", data.displayUsername);
  if (data.avatar) form.append("avatar", data.avatar);
  form.append("biography", data.biography);
  form.append("location", data.location);

  return form;
};

export function parseUpdatedUserFormData(formData: FormData): UserFormData {
  return {
    id: formData.get("id") as string,
    displayUsername: formData.get("displayUsername") as string,
    avatar: formData.get("avatar") as File | null,
    biography: formData.get("biography") as string,
    location: formData.get("location") as string,
  };
}
