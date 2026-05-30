"use client";
import { signinFormValidation } from "@/actions/auth";
import { PasswordVisibility } from "@/components/ui/icons/PasswordVisibility";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { type FormSigninState } from "@/shared/utils/schemas/validations";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useActionState, useEffect, useState } from "react";
const initialState: FormSigninState = {
  success: false,
  message: undefined,
  errors: null,
  data: {
    email: "",
    password: "",
  },
};
export default function SigninForm() {
  const [state, formAction, pending] = useActionState(signinFormValidation, initialState);
  const [showPass, setShowPass] = useState(false);
  const { success, error } = useToast();
  useEffect(() => {
    if (state.success) {
      success("Has iniciado sesión correctamente");
      window.location.href = "/";
    }
    if (state.errors) {
      error("Hubo un problema al iniciar sesión");
    }
  }, [state, success, error]);
  return (
    <form
      className="bg-background-950 w-[500px] rounded-2xl p-12 flex flex-col gap-10"
      action={formAction}
    >
      <h1 className="text-3xl">Iniciar Sesión</h1>
      <div>
        <FloatLabel>
          <InputText
            id="email"
            name="email"
            className="!w-full !bg-background-800/40 !border-background-50/30"
            defaultValue={state.data?.email}
          />
          <label htmlFor="email">Email</label>
        </FloatLabel>
        <div className="px-2">
          {state.errors &&
            state.errors.email &&
            state.errors.email.length > 0 &&
            state.errors.email.map((error) => (
              <span className="text-sm text-red-400/80" key={error}>
                {error}
              </span>
            ))}
        </div>
      </div>
      <div>
        <FloatLabel className="relative">
          <InputText
            id="password"
            name="password"
            className="!w-full !bg-background-800/40 !border-background-50/30"
            type={showPass ? "text" : "password"}
            defaultValue={state.data?.password}
          />
          <label htmlFor="password">Contraseña</label>
          <button
            className=" absolute! h-full top-0 right-0 flex-col justify-end pr-3 pb-1 cursor-pointer"
            onClick={() => setShowPass(!showPass)}
            type="button"
          >
            <PasswordVisibility isHidden={showPass} className="h-8 w-6 fill-background-50/70" />
          </button>
        </FloatLabel>
        <div className="px-2">
          {state.errors &&
            state.errors.password &&
            state.errors.password.length > 0 &&
            state.errors.password.map((error) => (
              <span className="text-sm text-red-400/80" key={error}>
                {error}
              </span>
            ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className={`bg-background border-[1px] border-background-50/40 py-3 rounded-md text-lg text-background-50 font-semibold  transition-all duration-50  flex items-center justify-center ${pending ? "bg-background/40" : "cursor-pointer hover:bg-background/40"}`}
      >
        {pending ? <span className="loader"></span> : "Iniciar Sesión"}
      </button>
    </form>
  );
}
