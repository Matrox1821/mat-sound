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
      .select("id,avatar,name,description,listeners,social,is_verified,covers")
      .eq("id", id);

    if (!data)
      return customError({
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
        message: "Artist does not exist",
      });

    const artist = data[0];

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: { artist },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
