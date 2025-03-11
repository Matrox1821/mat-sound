"use server";
import { adminQuery } from "@/queryFn";
import { setLoginCookies } from "@/shared/apiShared";
export async function adminSignInFormValidation(
  currentState: any,
  formData: FormData
) {
  try {
    const email = formData.get("email"),
      password = formData.get("password");

    const user = await adminQuery().signinUser({ email, password });
    console.log(user);
    if (user.errors.length !== 0)
      return { errors: user.errors, success: false };

    const userStringify = JSON.stringify(user.data.user);
    await setLoginCookies(userStringify, user.data.admin_token, true);
    return { success: true, errors: [] };
  } catch (error) {
    return { errors: [{ message: "Unknown error" }], success: false };
  }
}
