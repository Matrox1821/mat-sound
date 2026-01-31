"use client";
import { useCallback, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";
import { UserFormData } from "@shared-types/form.types";
import { UserData } from "@shared-types/user.types";
import { toUpdateUserFormData } from "@/shared/formData/userForm";
import { updateUserServer } from "@/actions/user";
import { CustomInputAdminForm } from "@components/features/inputs/CustomInputAdminForm";
import { InputUserAvatar } from "@/components/features/inputs/InputUserAvatar";

export const maUserToEditFormData = (user: UserData): UserFormData => {
  return {
    id: user.id,
    avatar: null,
    biography: user.biography || "",
    location: user.location || "",
    displayUsername: user.displayUsername,
  };
};

export function EditUserForm({ user }: { user: UserData }) {
  const parsedTrack = maUserToEditFormData(user);
  const [formData, setFormData] = useState<UserFormData>(parsedTrack);
  const [isCropping, setIsCropping] = useState(false);

  const { createEntity, success } = useCreateEntity({
    toFormData: toUpdateUserFormData,
    serverAction: updateUserServer,
    successMessage: "Perfil editado con éxito",
    errorMessage: "Ocurrió un error al editar el perfil",
  });
  const handleChange = useCallback(
    <K extends keyof UserFormData>(field: K, value: UserFormData[K]) => {
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
      redirect(`/user/${user.username}`);
    }
  }, [success, formData.avatar, user]);
  return (
    <form
      onSubmit={handleSubmit}
      className={`w-[400px] flex flex-col gap-4 text-xs overflow-auto m-4 `}
      noValidate
    >
      <article className="flex flex-col text-sm gap-6">
        <InputUserAvatar
          onChange={(val: any) => handleChange("avatar", val)}
          defaultImage={user.avatar ? `${user.avatar}?t=${user.updatedAt}` : null}
          setIsCropping={setIsCropping}
          isCropping={isCropping}
        />
        <CustomInputAdminForm
          title="Nombre de usuario:"
          name="displayUsername"
          type="text"
          value={formData.displayUsername}
          onChange={(val: any) => handleChange("displayUsername", val)}
          isRequired
          cssStyles={{ display: isCropping ? "none" : "flex" }}
        />
        <CustomInputAdminForm
          title="Biografia:"
          name="biography"
          type="textarea"
          value={formData.biography}
          onChange={(val: any) => handleChange("biography", val)}
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
