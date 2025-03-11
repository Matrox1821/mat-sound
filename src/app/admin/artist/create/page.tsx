"use client";
import { createArtistServer } from "@/actions/artist";
import { CustomInput } from "@/components/input/CustomInput";
import { JsonElementsInput } from "@/components/input/JsonElementsInput";
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
    <form
      action={formAction}
      className="w-[850px] mt-8 rounded-lg border-2 border-accent/40 p-8 flex flex-col gap-4 text-xs"
    >
      <CustomInputAdminForm
        title="Nombre del artista:"
        name="name"
        type="text"
        isRequired
      />
      <CustomInputAdminForm
        title="Avatar:"
        name="image"
        type="file"
        isRequired
      />
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
      <CustomInputAdminForm
        title="Descripción:"
        name="description"
        type="textarea"
        isRequired
      />
      <CustomInputAdminForm
        title="Está verificado?"
        name="is_verified"
        type="checkbox"
        isRequired
      />
      <div className="flex flex-col gap-2 relative w-full">
        <h2 className="flex">Oyentes regionales:</h2>
        <JsonElementsInput name="regional_listeners" />
      </div>
      <div className="flex flex-col gap-2 relative w-full">
        <h2 className="flex">Redes sociales:</h2>
        <JsonElementsInput name="socials" />
      </div>
      <CustomInputAdminForm
        title="Portadas:"
        name="covers"
        type="file"
        isMultiple
        isRequired
      />
      <button
        type="submit"
        className="bg-accent/60 text-content/90 font-normal text-xl rounded-md h-10 hover:bg-accent/80 hover:text-content"
      >
        Ingresar
      </button>
    </form>
  );
}

function CustomInputAdminForm(props: {
  title: string;
  type: "text" | "textarea" | "checkbox" | "file" | "number";
  isRequired?: boolean;
  name: string;
  isMultiple?: boolean;
  inBox?: boolean;
}) {
  return (
    <CustomInput
      {...props}
      labelStyle={`${props.inBox ? "flex-col gap-2 w-full" : "flex-col gap-2"}`}
      titleStyle="text-base"
      inputStyle={`w-full bg-background border-2 border-content/70 rounded-md focus-visible:border-accent/90 focus:border-2 outline-none ${
        props.type === "textarea" ? "h-32 py-1 pl-1 text-sm" : "h-8 py-4 pl-1"
      }`}
      previewImageStyle={`${
        props.isMultiple
          ? "h-24 verflow-y-auto w-full grid gap-2 grid-cols-3"
          : "h-22 w-22 flex justify-center"
      }  items-center p-2 o overflow-x-hidden border-2 border-accent/70 rounded-md`}
    />
  );
}
