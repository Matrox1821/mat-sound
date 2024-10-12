import { supabase } from "../../lib/supabase";

export async function GET() {
  const { data: artists } = await supabase
    .from("artists")
    .select("*, albums(id), tracks(id)");
  if (!artists) return;
  const newArtists = artists.map((artist) => {
    const { tracks, albums, ...restArtists } = artist;
    return { ...restArtists, tracks: tracks.length, album: albums.length };
  });

  return new Response(JSON.stringify({ artists: newArtists }), {
    headers: { "content-type": "application/json" },
  });
}
