"use client";
import { signupFormValidation } from "@/actions/auth";
import { PasswordVisibility } from "@/components/ui/icons/PasswordVisibility";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { type FormSignupState } from "@/shared/utils/schemas/validations";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useActionState, useEffect, useState } from "react";

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
  const [showPass, setShowPass] = useState(false);

  const [showConfirmedPass, setShowConfirmedPass] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    if (state.success) {
      success("Has creado tu sesión correctamente");
      window.location.href = "/";
    }
    if (state.errors) {
      error("Hubo un problema al crear tu sesión");
    }
  }, [state, success, error]);
  return (
    <form
      className="bg-background-950 w-[500px] rounded-2xl p-12 flex flex-col gap-10 "
      action={formAction}
    >
      <h1 className="text-3xl">Regístrate</h1>
      <div>
        <FloatLabel>
          <InputText
            id="username"
            name="username"
            className="!w-full !bg-background-800/40 !border-background-50/30"
            defaultValue={state.data?.username}
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
        <FloatLabel>
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
        <ul className="px-8 list-disc!">
          {state.errors &&
            state.errors.password &&
            state.errors.password.length > 0 &&
            state.errors.password.map((error) => (
              <li className="text-sm text-red-400/80 list-disc!" key={error}>
                {error}
              </li>
            ))}
        </ul>
      </div>
      <div>
        <FloatLabel>
          <InputText
            id="confirm-password"
            name="confirm-password"
            className="!w-full !bg-background-800/40 !border-background-50/30"
            type={showConfirmedPass ? "text" : "password"}
            defaultValue={state.data?.confirmPassword}
          />
          <label htmlFor="confirm-password">Confirmar contraseña</label>
          <button
            className=" absolute! h-full top-0 right-0 flex-col justify-end pr-3 pb-1 cursor-pointer"
            onClick={() => setShowConfirmedPass(!showConfirmedPass)}
            type="button"
          >
            <PasswordVisibility
              isHidden={showConfirmedPass}
              className="h-8 w-6 fill-background-50/70"
            />
          </button>
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
