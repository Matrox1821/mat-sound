"use client";
import { adminSigninFormValidation } from "@/actions/auth";
import CustomInputAdminForm from "@/components/ui/inputs/CustomInputAdminForm";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";

const initialState = {
  errors: [],
  success: false,
};
export default function AdminSigninPage() {
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
    <main className="w-full h-full flex justify-center items-center bg-background">
      <form
        action={formAction}
        className="w-80 h-80 rounded-lg border-2 border-accent-400 p-8 flex flex-col gap-8"
      >
        <CustomInputAdminForm title="Ingrese email:" name="email" type="email" />
        <CustomInputAdminForm title="Ingrese contraseña:" name="password" type="password" />
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
