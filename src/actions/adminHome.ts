"use server";
import { allAlbumsCounter } from "@/shared/server/album/album.repository";
import { allArtistsCounter } from "@/shared/server/artist/artist.repository";
import { getRecentActivity } from "@/shared/server/content/content.repository";
import { allGenresCounter } from "@/shared/server/genre/genre.repository";
import { allTracksCounter } from "@/shared/server/track/track.repository";
import { ImageSizes } from "@/types/common.types";

export async function getTotalData(): Promise<{
  tracks: number;
  albums: number;
  artists: number;
  genres: number;
}> {
  const tracks = await allTracksCounter();
  const albums = await allAlbumsCounter();
  const artists = await allArtistsCounter();
  const genres = await allGenresCounter();

  return {
    tracks,
    albums,
    artists,
    genres,
  };
}

export async function getRecentData() {
  const rows = await getRecentActivity();

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    cover: row.cover as ImageSizes,
    type: row.type,
    createdAt: row.created_at,
    extra: row.extra ?? null,
  }));
}
