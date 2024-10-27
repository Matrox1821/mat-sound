import type { APIContext } from "astro";
import { supabase } from "../../../../lib/supabase";
import { customError, onSuccessRequest, onThrowError } from "../../apiService";
import { HttpStatusCode } from "../../../../types/httpStatusCode";
export const prerender = false;
export async function GET({ params }: APIContext) {
  try {
    const id = params.id;

    if (!id)
      return customError({
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
        message: "Error requesting id",
      });

    const { data } = await supabase
      .from("artists")
      .select(
        "tracks(id,image,name,order_in_album,song_url,created_at,release_date,copyright,reproductions,seconds,album:albums(name,id,image),artist:artists(name,id,avatar))"
      )
      .eq("id", id);

    if (!data)
      return customError({
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
        message: "Artist does not exist",
      });

    const { tracks } = data[0];

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: { tracks },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
