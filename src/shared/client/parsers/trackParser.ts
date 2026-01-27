import { playerTrackProps } from "@shared-types/track.types";

export function parseTrackByPlayer(track: any): playerTrackProps {
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
    artists: track.artists
      ? track.artists.map((a: any) => ({
          id: a.id ?? a.artist?.id,
          name: a.name ?? a.artist?.name,
          avatar: a.avatar ?? a.artist?.avatar,
        }))
      : [],
    albums: track.albums
      ? track.albums.map((a: any) => ({
          id: a.id ?? a.album?.id,
          name: a.name ?? a.album?.name,
          cover: a.cover ?? a.album?.cover,
        }))
      : [],
  };
}
