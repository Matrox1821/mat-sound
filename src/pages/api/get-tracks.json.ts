import { supabase } from "../../lib/supabase";

export async function GET() {
  const { data: tracks } = await supabase.from("tracks").select("*");

  const { data: albums } = await supabase
    .from("albums")
    .select("id, image, name");

  const { data: artists } = await supabase
    .from("artists")
    .select("id, name, image");

  if (tracks && albums && artists) {
    const newTracks = tracks.map((track) => {
      const { album_id, artist_id, image, ...restOfTrack } = track;
      const album = albums.find((album) => album.id === track.album_id);
      const artist = artists.find((artist) => artist.id === artist_id);

      return {
        ...restOfTrack,
        image: image ? image : album?.image || null,
        artist: artist || null,
        album: album || null,
      };
    });

    return new Response(JSON.stringify({ tracks: newTracks }), {
      headers: { "content-type": "application/json" },
    });
  }
}
