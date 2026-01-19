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

export async function adminSigninFormValidation(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email"),
      password = formData.get("password");

    const user = await signinAdminUser({ email, password });

    if (user.errors.length !== 0 || !user) throw new Error();

    const userStringify = JSON.stringify(user.data.user);

    await setLoginCookies(userStringify, user.data.admin_token, true);
    return { success: true, errors: [] };
  } catch (error: any) {
    return { errors: [{ message: "Unknown error" }, { message: error.message }], success: false };
  }
}

export async function signupFormValidation(
  prevState: FormSignupState,
  formData: FormData
): Promise<FormSignupState> {
  try {
    const email = formData.get("email") as string,
      username = formData.get("username") as string,
      password = formData.get("password") as string,
      confirmPassword = formData.get("confirm-password") as string;
    const values = { email, username, password, confirmPassword };

    const validatedFields = SignupFormSchema.safeParse(values);

    if (!validatedFields.success) {
      const flattenedErrors = z.flattenError(validatedFields.error);
      return {
        success: false,
        message: "Error de validación. Revisa los campos.",
        errors: flattenedErrors.fieldErrors,
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
        biography: "",
        location: "",
      },
    });
    if (!user) {
      throw new Error();
    }
    return { success: true, message: "Registro completo", errors: null, data: values };
  } catch (error: any) {
    return {
      success: false,
      message: "Error inesperado. Vuelve a intentarlo.",
      errors: error.message,
      data: { ...prevState.data },
    };
  }
}

export async function signinFormValidation(
  prevState: FormSigninState,
  formData: FormData
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
