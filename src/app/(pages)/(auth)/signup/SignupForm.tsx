"use client";
import { signupFormValidation } from "@/actions/auth";
import { type FormSignupState } from "@/shared/utils/schemas/validations";
import { redirect } from "next/navigation";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useActionState, useEffect } from "react";

const initialState: FormSignupState = {
  success: false,
  message: undefined,
  errors: null,
  data: {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
};
export default function SignupForm() {
  const [state, formAction] = useActionState(signupFormValidation, initialState);
  useEffect(() => {
    if (state.success) redirect("/signin");
  }, [state.success]);
  return (
    <form
      className="bg-background-950 w-[500px] rounded-2xl p-12 flex flex-col gap-12"
      action={formAction}
    >
      <h1 className="text-3xl">Regístrate</h1>
      <div>
        <FloatLabel>
          <InputText
            id="username"
            name="username"
            className="!w-full !bg-background-800/40 !border-background-50/30"
          />
          <label htmlFor="username">Nombre de Usuario</label>
        </FloatLabel>
        <div className="px-2">
          {state.errors &&
            state.errors.username &&
            state.errors.username.length > 0 &&
            state.errors.username.map((error) => (
              <span className="text-sm text-red-400/80" key={error}>
                {error}
              </span>
            ))}
        </div>
      </div>
      <div>
        <FloatLabel>
          <InputText
            id="email"
            name="email"
            className="!w-full !bg-background-800/40 !border-background-50/30"
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
        <FloatLabel>
          <InputText
            id="password"
            name="password"
            className="!w-full !bg-background-800/40 !border-background-50/30"
          />
          <label htmlFor="password">Contraseña</label>
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
      <div>
        <FloatLabel>
          <InputText
            id="confirm-password"
            name="confirm-password"
            className="!w-full !bg-background-800/40 !border-background-50/30"
          />
          <label htmlFor="confirm-password">Confirmar contraseña</label>
        </FloatLabel>
        <div className="px-2">
          {state.errors &&
            state.errors.confirmPassword &&
            state.errors.confirmPassword.length > 0 &&
            state.errors.confirmPassword.map((error) => (
              <span className="text-sm text-red-400/80" key={error}>
                {error}
              </span>
            ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-background border-[1px] border-background-50/40 py-3 rounded-md text-lg text-background-50 font-semibold cursor-pointer transition-all duration-50 hover:bg-background/40"
      >
        Registrarse
      </button>
    </form>
  );
}
