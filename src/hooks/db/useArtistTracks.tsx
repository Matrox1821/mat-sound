import type { artistRecentsTracksProps, TracksByArtistIdQuery } from "@/types";
import { getTracksByArtistId } from "@/queryFn/client";

export default async function getArtistTracks({
  id,
  query = { sortBy: "release_date", order: "desc", limit: 1 },
}: {
  id: string;
  query?: TracksByArtistIdQuery;
}) {
  const tracks = await getTracksByArtistId({ id, query }).then((data) => {
    return data?.data || null;
  });
  const parsedTracks = tracks?.map((element) => {
    const { track } = element;
    return {
      id: track.id,
      name: track.name,
      image: track.image,
      song: track.song,
      releaseDate: track.release_date,
      duration: track.duration,
      reproductions: track.reproductions,
      likes: track._count?.likes,
      albums: track.albums,
    };
  });
  return { tracks: parsedTracks as artistRecentsTracksProps[] | null };
}
