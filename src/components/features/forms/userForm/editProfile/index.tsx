"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";
import { UserFormData } from "@shared-types/form.types";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { UserData } from "@shared-types/user.types";
import { toUpdateUserFormData } from "@/shared/formData/userForm";
import { updateUserServer } from "@/actions/user";
import CustomInputAdminForm from "@components/features/inputs/CustomInputAdminForm";

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
  const stepperRef = useRef<any>(null);
  const [step, setStep] = useState(1);
  const { success: successMessage, error } = useToast();
  const [formData, setFormData] = useState<UserFormData>(parsedTrack);
  const { createEntity, success, errors } = useCreateEntity({
    toFormData: toUpdateUserFormData,
    serverAction: updateUserServer,
    successMessage: "Canción editada con éxito",
    errorMessage: "Ocurrió un error al editar la canción",
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
      successMessage("Success!");
      redirect(`/user/${user.id}`);
    }
    if (errors.length !== 0) {
      Object.entries(errors).forEach(([key, value]) => {
        error(key);
      });
    }
  }, [success, errors, successMessage, error]);
  return (
    <form
      onSubmit={handleSubmit}
      className="w-[750px] flex flex-col gap-4 text-xs overflow-auto"
      noValidate
    >
      <article className="flex flex-col">
        <CustomInputAdminForm
          title="Nombre de usuario:"
          name="displayUsername"
          type="text"
          value={formData.displayUsername}
          onChange={(val: any) => handleChange("displayUsername", val)}
          isRequired
        />
        <div className="flex pt-4 gap-4">
          <button
            className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer"
            type="button"
            onClick={() => {
              stepperRef.current.prevCallback();
              setStep(step - 1);
            }}
          >
            <i className="pi pi-arrow-left"></i>Atrás
          </button>
          <button
            className="bg-accent-950/20 border border-accent-950/50 p-4 text-white hover:bg-accent-950/25 cursor-pointer font-bold rounded-md"
            type="submit"
          >
            Guardar Cambios
          </button>
        </div>
      </article>
    </form>
  );
}
