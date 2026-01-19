"use client";
import { useActionState, useEffect, useState } from "react";
import CustomInputAdminForm from "../../inputs/CustomInputAdminForm";
import { createGenreServer } from "@/actions/genre";
import { redirect, usePathname } from "next/navigation";
import { toast } from "sonner";

const initialState = {
  errors: [],
  success: false,
};

export function CreateGenreForm() {
  const [state, formAction] = useActionState(createGenreServer, initialState);
  const [inputs, setInputs] = useState(1);
  const pathname = usePathname();

  useEffect(() => {
    if (state.success) {
      toast.success("Género creado", { duration: 2000 });
      redirect(pathname);
    }
    if (state.errors.length > 0) {
      toast.error("Problema al crear el género", { duration: 2000 });
    }
  }, [state.success, pathname, state.errors.length]);

  return (
    <form action={formAction} className="w-[750px] flex flex-col gap-4 text-xs overflow-hidden">
      <h3 className="text-xl font-semibold">Crear Género</h3>
      <ul className="max-h-[300px] w-full overflow-auto flex flex-col items-center">
        {Array(inputs)
          .fill(null)
          .map((_, i) => (
            <li className="pb-8 flex" key={i}>
              <CustomInputAdminForm title="" name="genre" type="text" key={i} />
            </li>
          ))}
      </ul>
      <div className="flex w-full justify-end pr-4 gap-4">
        <button
          type="button"
          className="flex gap-2 items-center bg-background-700/30 p-4 rounded-md cursor-pointer border border-background-400"
          disabled={inputs === 1}
          onClick={() => setInputs(inputs - 1)}
        >
          <i className="pi pi-minus"></i>
        </button>
        <button
          type="button"
          className="flex gap-2 items-center bg-background-700/30 p-4 rounded-md cursor-pointer border border-background-400"
          onClick={() => setInputs(inputs + 1)}
        >
          <i className="pi pi-plus"></i>
        </button>
      </div>
      <div className="flex justify-end gap-2 p-2 pt-4">
        <button
          className="bg-accent-950/20 border border-accent-950/50 p-4 text-white hover:bg-accent-950/25 cursor-pointer font-bold rounded-md flex"
          type="submit"
        >
          Crear
        </button>
      </div>
    </form>
  );
}
