import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import { HttpStatusCode } from "../../../types/httpStatusCode";
import { customError, onSuccessRequest, onThrowError } from "../apiService";
export const GET: APIRoute = async () => {
  try {
    const { data: albums } = await supabase
      .from("albums")
      .select(
        "id,image,name,copyright,release_date,artist:artists(id,name,avatar)"
      );

    if (!albums)
      return customError({
        httpStatusCode: HttpStatusCode.NOT_FOUND,
        message: "Albums does not exist",
      });

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: { albums },
    });
  } catch (error) {
    return onThrowError(error);
  }
};

interface albumBody {
  name: string;
  image: string;
  artist_id: string;
  release_date: string;
  copyright: string;
}

export const POST: APIRoute = async ({ request }) => {
  const requestBody = (await request.json()) as albumBody;
  if (!requestBody)
    return customError({
      httpStatusCode: HttpStatusCode.BAD_REQUEST,
      message: "Data is required",
    });
  const { name, artist_id, copyright, image, release_date } = requestBody;
  try {
    const { data: album } = await supabase
      .from("albums")
      .insert({
        name,
        artist_id,
        copyright: JSON.parse(copyright),
        image,
        release_date: release_date,
      })
      .select("*");

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: { album },
    });
  } catch (error) {
    return onThrowError(error);
  }
};
