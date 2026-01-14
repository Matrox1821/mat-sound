import { trackPageProps } from "@/types";
import { APITrack, playerTrackProps } from "@/types/trackProps";

export function parseTracks(data: APITrack[] | null): trackPageProps[] | null {
  if (!data) return null;
  return data.map((newData) => {
    const { release_date, albums, artists, playlists, ...restData } = newData;
    return {
      ...restData,
      releaseDate: release_date,
      artists: artists?.map((artist) => ({ ...artist })) || null,
      albums: albums?.map((album) => ({ ...album.album })) || null,
      playlists: playlists,
    };
  });
}

export function parseTrackByPlayer(track: any): playerTrackProps {
  /* console.log({ track }); */
  return {
    id: track.id,
    name: track.name,
    cover: track.cover ?? track.avatar ?? track.image,
    song: track.song ?? "",
    duration: track.duration ?? 0,
    reproductions: track.reproductions ?? 0,
    releaseDate: track.releaseDate ?? track.release_date ?? "",
    likes: track?.likes || 0,
    lyrics: track.lyrics || "",
    isLiked: track.isLiked,
    artists: track.artists
      ? track.artists.map((a: any) => ({
          id: a.id ?? a.artist?.id,
          name: a.name ?? a.artist?.name,
          avatar: a.avatar ?? a.artist?.avatar,
        }))
      : [],
    playlists: track.playlists,
    albums: track.albums
      ? track.albums.map((a: any) => ({
          id: a.id ?? a.album?.id,
          name: a.name ?? a.album?.name,
          cover: a.cover ?? a.album?.cover,
        }))
      : [],
  };
}
