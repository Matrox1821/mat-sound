import type { APIRoute } from "node_modules/astro/dist/types/public/common";
import { supabase } from "../../../lib/supabase";
import { HttpStatusCode } from "../../../types/httpStatusCode";
import { customError, onSuccessRequest, onThrowError } from "../apiService";

export const GET: APIRoute = async ({ url }) => {
  const max = url.searchParams.get("max") || 6;

  const exclude = url.searchParams.get("exclude") || null;

  const parcedExclude =
    exclude &&
    `(${JSON.parse(exclude)
      .map((id: string) => `"${id}"`)
      .join(",")})`;

  let query = supabase
    .from("random_tracks")
    .select(
      "id,image,name,order_in_album,song_url,release_date,copyright,album:albums(id,name,image),artist:artists(id,name,avatar)"
    )
    .range(0, +max - 1);

  if (parcedExclude) {
    query = query.not("id", "in", parcedExclude);
  }

  const { data: tracks } = await query;

  if (!tracks)
    return customError({
      message: "Tracks table not found",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });

  return onSuccessRequest({
    httpStatusCode: HttpStatusCode.OK,
    data: { tracks },
  });
};

interface trackBody {
  name: string;
  image: string;
  song_url: string;
  artist_id: string;
  album_id: string;
  order_in_album: string;
  release_date: string;
  copyright: string;
  reproductions: number;
  seconds: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as trackBody;

    if (!body)
      return customError({
        message: "Data error",
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
      });
    const {
      album_id,
      artist_id,
      image,
      name,
      order_in_album,
      song_url,
      copyright,
      release_date,
      reproductions,
      seconds,
    } = body;
    let track;
    if (album_id === "none") {
      const { data } = await supabase
        .from("tracks")
        .insert({
          name,
          image,
          artist_id,
          song_url,
          copyright: JSON.parse(copyright),
          release_date,
          reproductions,
          seconds,
        })
        .select("*");

      if (!data)
        return customError({
          message: "Data error",
          httpStatusCode: HttpStatusCode.BAD_REQUEST,
        });

      track = data[0];

      return onSuccessRequest({
        httpStatusCode: HttpStatusCode.OK,
        data: { track },
      });
    }
    const { data: albums } = await supabase
      .from("albums")
      .select("image,copyright")
      .eq("id", album_id);
    const { image: albumImage, copyright: albumCopyright } = albums![0];
    const { data, error } = await supabase
      .from("tracks")
      .insert({
        name,
        image: albumImage,
        artist_id,
        song_url,
        album_id,
        copyright: albumCopyright,
        release_date,
        order_in_album: +order_in_album,
        reproductions,
        seconds,
      })
      .select("*");
    if (!data || error)
      return customError({
        message: "Data error",
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
      });

    track = data[0];
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: { track },
    });
  } catch (error) {
    return onThrowError(error);
  }
};
