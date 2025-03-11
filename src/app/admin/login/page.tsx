"use client";
import { adminSignInFormValidation } from "@/actions/auth";
import CustomInputAdminForm from "@/components/input/CustomInputAdminForm";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
const initialState = {
  errors: [],
  success: false,
};
export default function Page() {
  const [state, formAction] = useActionState(
    adminSignInFormValidation,
    initialState
  );
  const errorToast = (text: string) => toast.error(text);
  const successToast = (text: string, options: any) =>
    toast.success(text, options);

  useEffect(() => {
    if (state.errors.length !== 0) {
      state.errors.map((error: { message: string }) => {
        errorToast(error.message);
      });
    }
    if (state.success) {
      successToast("Success!", { autoClose: 2000 });
      redirect("/admin");
    }
  }, [state]);
  return (
    <main className="col-span-full row-span-full flex justify-center items-center">
      <form
        action={formAction}
        className="w-80 h-80 rounded-lg border-2 border-accent/40 p-8 flex flex-col gap-8"
      >
        <CustomInputAdminForm
          title="Ingrese email:"
          name="email"
          type="email"
        />
        <CustomInputAdminForm
          title="Ingrese contraseña:"
          name="password"
          type="password"
        />
        <button
          type="submit"
          className="bg-accent/60 text-content/90 font-normal text-xl rounded-md h-10 hover:bg-accent/80 hover:text-content"
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}
