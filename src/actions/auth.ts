"use server";

import { auth } from "@/lib/auth";
import { signinAdminUser } from "@/queryFn/admin/accountApi";
import { setLoginCookies } from "@/shared/client/apiShared";
import {
  type FormSigninState,
  type FormSignoutState,
  type FormSignupState,
  SigninFormSchema,
  SignupFormSchema,
} from "@/shared/utils/schemas/validations";
import { headers } from "next/headers";
import z from "zod";

const normalizeSignupErrors = (
  errors: {
    email?: string[];
    username?: string[];
    password?: string[];
    repeatedPassword?: string[];
  } = {},
) => ({
  email: errors.email ?? [],
  username: errors.username ?? [],
  password: errors.password ?? [],
  repeatedPassword: errors.repeatedPassword ?? [],
});

export async function adminSigninFormValidation(prevState: any, formData: FormData) {
  try {
    const username = formData.get("username"),
      password = formData.get("password");
    const user = await signinAdminUser({ username, password });
    if ((user.errors && user.errors.length !== 0) || !user) throw new Error();

    const userStringify = JSON.stringify(user.user);

    await setLoginCookies(userStringify, user.admin_token, true);
    return { success: true, errors: [] };
  } catch (error: any) {
    return { errors: [{ message: "Unknown error" }, { message: error.message }], success: false };
  }
}

export async function signupFormValidation(
  prevState: FormSignupState,
  formData: FormData,
): Promise<FormSignupState> {
  const email = formData.get("email") as string,
    username = formData.get("username") as string,
    password = formData.get("password") as string,
    repeatedPassword = formData.get("confirm-password") as string;
  const values = { email, username, password, repeatedPassword };
  try {
    const validatedFields = SignupFormSchema.safeParse(values);
    if (!validatedFields.success) {
      const flattenedErrors = z.flattenError(validatedFields.error);
      console.log("flattenedErrors", flattenedErrors.formErrors);
      return {
        success: false,
        message: "Error de validación. Revisa los campos.",
        errors: normalizeSignupErrors(flattenedErrors.fieldErrors),
        data: { ...prevState.data, ...values },
      };
    }
    const user = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
        username,
        displayUsername: username,
      },
      headers: await headers(),
    });
    if (!user) {
      throw new Error();
    }

    return { success: true, message: "Registro completo", errors: null, data: values };
  } catch (error: any) {
    const errorCode = error.body?.code || error.code;
    const errorMessage = error.body?.message || error.message;

    const errorMessages: Record<
      string,
      { field: "email" | "username" | "password"; message: string }
    > = {
      USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
        field: "email",
        message: "Ya existe una cuenta con ese correo electrónico.",
      },
      EMAIL_ALREADY_EXISTS: {
        field: "email",
        message: "Ya existe una cuenta con ese correo electrónico.",
      },
      INVALID_EMAIL: {
        field: "email",
        message: "El correo electrónico no es válido.",
      },
    };

    const mapped = errorMessages[errorCode];
    const fallbackMessage =
      errorMessage?.includes("already") || errorMessage?.includes("exists")
        ? "Ya existe una cuenta con ese correo electrónico."
        : "Error inesperado. Vuelve a intentarlo.";

    return {
      success: false,
      message: mapped ? mapped.message : fallbackMessage,
      errors: normalizeSignupErrors({
        [mapped?.field || "email"]: [mapped ? mapped.message : fallbackMessage],
      }),
      data: values,
    };
  }
}

export async function signinFormValidation(
  prevState: FormSigninState,
  formData: FormData,
): Promise<FormSigninState> {
  try {
    const email = formData.get("email") as string,
      password = formData.get("password") as string;
    const values = { email, password };

    const validatedFields = SigninFormSchema.safeParse(values);

    if (!validatedFields.success) {
      const flattenedErrors = z.flattenError(validatedFields.error);
      return {
        success: false,
        message: "Error de validación. Revisa los campos.",
        errors: flattenedErrors.fieldErrors,
        data: { ...prevState.data, ...values },
      };
    }

    const user = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });
    if (!user) {
      throw new Error();
    }
    return { success: true, message: "Sesión Iniciada", errors: null, data: values };
  } catch (error: any) {
    return {
      success: false,
      message: "Error inesperado. Vuelve a intentarlo.",
      errors: error.message,
      data: { ...prevState.data },
    };
  }
}

export async function signoutFormValidation(): Promise<FormSignoutState> {
  try {
    const user = await auth.api.signOut({
      headers: await headers(),
    });
    if (!user) {
      throw new Error();
    }
    return { success: true, message: "Sesión Iniciada", errors: null };
  } catch (error: any) {
    return {
      success: false,
      message: "Error inesperado. Vuelve a intentarlo.",
      errors: error.message,
    };
  }
}
