"use client";
import { adminSigninFormValidation } from "@/actions/auth";
import { CustomInputAdminForm } from "@components/features/inputs/CustomInputAdminForm";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";

const initialState = {
  errors: [],
  success: false,
};
export default function AdminSigninForm() {
  const [state, formAction] = useActionState(adminSigninFormValidation, initialState);
  const { error: toastError, success } = useToast();

  useEffect(() => {
    if (state.errors.length !== 0) {
      state.errors.map((error: { message: string }) => {
        toastError(error.message);
      });
    }
    if (state.success) {
      success("Success!");
      redirect("/admin");
    }
  }, [state, toastError, success]);
  return (
    <form
      action={formAction}
      className="w-80 h-80 rounded-lg border-2 border-contrast-900/50 p-8 flex flex-col gap-8 bg-contrast-950/15"
    >
      <CustomInputAdminForm title="Ingrese email:" name="email" type="email" />
      <CustomInputAdminForm title="Ingrese contraseña:" name="password" type="password" />
      <button
        type="submit"
        className="bg-contrast-800/50 text-content-900 font-normal text-xl rounded-md h-10 hover:bg-contrast-800/80 hover:scale-101 hover:text-content-950 cursor-pointer border border-contrast-950"
      >
        Ingresar
      </button>
    </form>
  );
}
