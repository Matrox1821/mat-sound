"use client";
import { Button } from "primereact/button";
import { useActionState, useEffect, useState } from "react";
import CustomInputAdminForm from "../../inputs/CustomInputAdminForm";
import { createGenreServer } from "@/actions/genre";
import { redirect, usePathname } from "next/navigation";
import { toast } from "sonner";

const initialState = {
  errors: [],
  success: false,
};

export function CreateGenreForm({ hide }: { hide: (e: React.SyntheticEvent) => void }) {
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
        <Button
          type="button"
          className="!bg-accent-700 text-content-900 hover:bg-accent-800 hover:text-content-950 !font-bold"
          icon="pi pi-minus"
          disabled={inputs === 1}
          onClick={() => setInputs(inputs - 1)}
        ></Button>
        <Button
          type="button"
          className="!bg-accent-700 text-content-900 hover:bg-accent-800 hover:text-content-950 !font-bold"
          icon="pi pi-plus"
          onClick={() => setInputs(inputs + 1)}
        ></Button>
      </div>
      <div className="flex justify-end gap-2 p-2 pt-4">
        <Button
          type="submit"
          className="!bg-accent-700 text-content-900 hover:bg-accent-800 hover:text-content-950 !font-bold"
        >
          Crear
        </Button>
        <Button
          label="Cancel"
          type="button"
          onClick={(e) => hide(e)}
          text
          className="text-primary-50 !bg-background"
        ></Button>
      </div>
    </form>
  );
}
