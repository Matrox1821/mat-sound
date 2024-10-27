import { supabase } from "../../../lib/supabase";
import type { APIContext } from "astro";
import { customError, onSuccessRequest, onThrowError } from "../apiService";
import { HttpStatusCode } from "../../../types/httpStatusCode";
export const prerender = false;

export async function GET({ params }: APIContext) {
  try {
    const id = params.id;

    if (!id)
      return customError({
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
        message: "Error requesting id",
      });

    const { data: track } = await supabase
      .from("tracks")
      .select(
        "id,image,name,order_in_album,song_url,release_date,copyright,reproductions,seconds,album:albums(id,name,image),artist:artists(id,name,avatar)"
      )
      .eq("id", id);

    if (!track || !track[0])
      return customError({
        httpStatusCode: HttpStatusCode.NOT_FOUND,
        message: "Track not found",
      });

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: { track: track[0] },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
