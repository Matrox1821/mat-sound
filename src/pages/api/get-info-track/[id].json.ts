import { supabase } from "../../../lib/supabase";
import type { APIContext } from "astro";
export const prerender = false;
export async function GET({ params }: APIContext) {
  const id = params.id;
  if (id) {
    const { data: track } = await supabase
      .from("tracks")
      .select("*")
      .eq("id", id);

    if (!track) return;

    const { album_id, artist_id, image, ...restTrack } = track[0];
    let album, albumImage;
    const { data: artist } = await supabase
      .from("artists")
      .select("id, name, image")
      .eq("id", track[0].artist_id);

    if (track && track[0].album_id !== null) {
      const { data: albumData } = await supabase
        .from("albums")
        .select("id,name,image")
        .eq("id", track[0].album_id);
      const { image: albumObjImage, ...albumObj } = albumData![0];
      albumImage = albumObjImage;
      album = albumObj;
    }
    const newTrack = {
      ...restTrack,
      image: image || albumImage || null,
      artist: artist![0],
      album: !album_id ? null : album,
    };
    return new Response(JSON.stringify({ track: newTrack }), {
      headers: { "content-type": "application/json" },
    });
  }
}
