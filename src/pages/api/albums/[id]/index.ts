import { supabase } from "../../../../lib/supabase";
import type { APIContext } from "astro";
import { HttpStatusCode } from "../../../../types/httpStatusCode";
import { customError, onSuccessRequest, onThrowError } from "../../apiService";

export async function GET({ params }: APIContext) {
  try {
    const id = params.id;

    if (!id)
      return customError({
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
        message: "Error requesting id",
      });
    const { data: albums } = await supabase
      .from("albums")
      .select(
        "id,image,name,copyright,release_date,artist:artists(id,name,avatar),tracks(*,artist:artist_id(name))"
      )
      .eq("id", id);

    if (!albums || !albums[0])
      return customError({
        httpStatusCode: HttpStatusCode.NOT_FOUND,
        message: "Album does not exist",
      });
    const { tracks, ...restAlbums } = albums[0];

    const orderedTracks = tracks.sort((first, second) => {
      if (first.order_in_album !== null && second.order_in_album !== null)
        return first.order_in_album - second.order_in_album;
      return -1;
    });

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: { album: { ...restAlbums, tracks: orderedTracks } },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
