import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { customError } from "../apiService";
import { HttpStatusCode } from "../../../types/httpStatusCode";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return customError({
      httpStatusCode: HttpStatusCode.BAD_REQUEST,
      message: "Email and password are required",
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return customError({
      httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      errors: [error],
      message: error.message,
    });
  }

  const { access_token, refresh_token } = data.session;

  cookies.set("sb-access-token", access_token, {
    path: "/",
  });
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
  });

  return redirect("/admin");
};
