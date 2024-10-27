import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { HttpStatusCode } from "../../../types/httpStatusCode";
import { customError, onSuccessRequest, onThrowError } from "../apiService";
import type { Json } from "src/lib/database.types";

export const GET: APIRoute = async () => {
  const { data: artists } = await supabase
    .from("artists")
    .select("id,avatar,name");

  if (!artists)
    return customError({
      httpStatusCode: HttpStatusCode.BAD_REQUEST,
      message: "Artist not found",
    });

  return onSuccessRequest({
    httpStatusCode: HttpStatusCode.OK,
    data: { artists },
  });
};

interface artistBody {
  name: string;
  avatar: string;
  description: string | null;
  listeners: number;
  social: string | null;
  is_verified: string;
  covers: string | null;
}

export const POST: APIRoute = async ({ request }) => {
  const requestBody = (await request.json()) as artistBody;
  if (!requestBody)
    return customError({
      httpStatusCode: HttpStatusCode.BAD_REQUEST,
      message: "Data is required",
    });
  const { name, avatar, description, listeners, social, is_verified, covers } =
    requestBody;
  try {
    const { data: artist } = await supabase
      .from("artists")
      .insert({
        name,
        avatar,
        description,
        listeners,
        social: social ? JSON.parse(social) : null,
        is_verified: is_verified === "on",
        covers: covers ? JSON.parse(covers) : null,
      })
      .select("*");

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: { artist },
    });
  } catch (error) {
    return onThrowError(error);
  }
};
