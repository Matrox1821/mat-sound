"use server";

import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";

export async function requireAuthenticatedAction() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    return session.user;
  }

  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin");
  const adminTokenCookie = cookieStore.get("admin_token");

  if (adminCookie?.value && adminTokenCookie?.value) {
    return { id: adminCookie.value };
  }

  throw new Error("Unauthorized");
}
