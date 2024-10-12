import type { APIContext } from "astro";
import { supabase } from "../../../lib/supabase";
export const prerender = false;
export async function GET({ params }: APIContext) {
  const id = params.id;
  if (id) {
    const { data: artists } = await supabase
      .from("artists")
      .select("*, albums(*), tracks(*)")
      .eq("id", id);
    if (!artists) return;
    console.log(id);
    const { tracks, albums, ...restArtist } = artists[0];

    if (tracks && albums && artists) {
      const newTracks = tracks.map((track) => {
        const { album_id, artist_id, image, ...restOfTrack } = track;
        const album = albums.find((album) => album.id === track.album_id);
        const artist = artists.find((artist) => artist.id === artist_id);

        return {
          ...restOfTrack,
          image: image ? image : album?.image || null,
          artist: artist?.name || null,
          album: album?.name || null,
        };
      });

      const newAlbums = albums.map((album) => {
        const { artist_id, ...restAlbum } = album;
        const artist = artists.find((artist) => artist.id === artist_id);
        return { ...restAlbum, artist: artist?.name || null };
      });
      return new Response(
        JSON.stringify({
          artist: { ...restArtist, albums, tracks: newTracks },
        }),
        {
          headers: { "content-type": "application/json" },
        }
      );
    }
  }
}
