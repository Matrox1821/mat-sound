"use client";
import { createArtistServer } from "@/actions/artist";
import CustomInputAdminForm from "@/components/UI/Inputs/CustomInputAdminForm";
import { JsonElementsInput } from "@/components/UI/Inputs/JsonElementsInput";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";
const initialState = {
  errors: [],
  success: false,
};
export default function Page() {
  const [state, formAction] = useActionState(createArtistServer, initialState);
  useEffect(() => {
    if (state.success) redirect("/admin");
  }, [state.success]);

  return (
    <main className="w-full h-screen flex justify-center items-center relative">
      <form
        action={formAction}
        className="relative w-[850px] max-h-[750px] rounded-lg border-2 border-accent-400 p-8 flex flex-col gap-4 text-xs overflow-auto"
      >
        <CustomInputAdminForm title="Nombre del artista:" name="name" type="text" isRequired />
        <div className="flex w-full gap-4 justify-between mt-8">
          <CustomInputAdminForm title="Avatar:" name="image" type="file" isRequired />
          <CustomInputAdminForm
            title="Portada principal:"
            name="page_cover"
            type="file"
            isRequired
          />
        </div>
        <div className="flex w-full gap-4">
          <CustomInputAdminForm
            title="Oyentes mensuales:"
            name="listeners"
            type="number"
            isRequired
            inBox
          />
          <CustomInputAdminForm
            title="Seguidores:"
            name="followers"
            type="number"
            inBox
            isRequired
          />
        </div>
        <CustomInputAdminForm title="Descripción:" name="description" type="textarea" isRequired />
        <CustomInputAdminForm title="Está verificado?" name="is_verified" type="checkbox" />
        <JsonElementsInput title="Oyentes regionales:" name="regional_listeners" />
        <JsonElementsInput title="Redes sociales:" name="socials" />
        <CustomInputAdminForm title="Portadas:" name="covers" type="file" isMultiple isRequired />
        <button
          type="submit"
          className="bg-accent-600 text-content-900 font-normal text-xl rounded-md h-10 hover:bg-accent-800 hover:text-content-950"
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}
