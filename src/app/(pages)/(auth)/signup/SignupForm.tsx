"use client";
import { signupFormValidation } from "@/actions/auth";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { type FormSignupState } from "@/shared/utils/schemas/validations";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "../components/PasswordInput";

const initialState: FormSignupState = {
  success: false,
  message: undefined,
  errors: null,
  data: {
    username: "",
    email: "",
    password: "",
    repeatedPassword: "",
  },
};
export default function SignupForm() {
  const [state, formAction] = useActionState(signupFormValidation, initialState);
  const { success, error } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      success("Has creado tu sesión correctamente");
      router.push("/");
    }
    if (state.errors) {
      error("Hubo un problema al crear tu sesión");
    }
  }, [router, state, success, error]);
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
        <PasswordInput
          id="password"
          name="password"
          label="Contraseña"
          defaultValue={state.data?.password}
        />
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
        <PasswordInput
          id="confirm-password"
          name="confirm-password"
          label="Confirmar contraseña"
          defaultValue={state.data?.repeatedPassword}
        />
        <div className="px-2">
          {state.errors &&
            state.errors.repeatedPassword &&
            state.errors.repeatedPassword.length > 0 &&
            state.errors.repeatedPassword.map((error) => (
              <span className="text-sm text-red-400/80" key={error}>
                {error}
              </span>
            ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-background border-[1px] border-background-50/40 py-3 rounded-md text-lg text-background-50 font-semibold cursor-pointer transition-colors duration-150 hover:bg-background/40"
      >
        Registrarse
      </button>
    </form>
  );
}
