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
      .from("albums")
      .select(
        "id,  tracks(id,image,name,order_in_album,song_url,created_at,release_date,copyright,reproductions,seconds,artist:artists(name,id,avatar))"
      )
      .eq("id", id)
      .order("order_in_album", {
        referencedTable: "tracks",
        ascending: true,
      });
    if (!data)
      return customError({
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
        message: "Album does not exist",
      });

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: { tracks: data[0].tracks },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
