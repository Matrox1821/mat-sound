import { JsonValue } from "@prisma/client/runtime/client";
import { TrackFull } from "../track/track.select";
import { AlbumContentRaw, PlaylistContentRaw, ArtistContentRaw } from "./content.select";
import { TrackCard, AlbumCard, ArtistCard, PlaylistCard } from "@shared-types/content.types";
import { ImageSizes } from "@/types/common.types";
export const asImageSizes = (value: JsonValue): ImageSizes | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as unknown as ImageSizes;
};
export const mapTrackToMediaCard = (track: TrackFull): TrackCard => ({
  type: "tracks",
  id: track.id,
  name: track.name,
  title: track.name,
  image: asImageSizes(track.cover),
  href: `/tracks/${track.id}`,
  song: track.song ?? "",
  duration: track.duration,
  lyrics: track.lyrics,
  reproductions: track.reproductions,
  likes: track._count.likes,
  artists: track.artists.map(({ id, name, avatar }) => ({
    id,
    name,
    avatar: asImageSizes(avatar),
  })),
});

export const mapAlbumRawToMediaCard = (raw: AlbumContentRaw): AlbumCard => ({
  type: "albums",
  id: raw.id,
  title: raw.name,
  image: asImageSizes(raw.cover),
  href: `/albums/${raw.id}`,
  artists: raw.artists.map(({ id, name, avatar }) => ({
    id,
    name,
    avatar: asImageSizes(avatar),
  })),
  tracks:
    raw.tracks?.map(({ track }) => {
      const { cover, _count, artists, albums, ...rest } = track;
      return {
        ...rest,
        cover: asImageSizes(cover),
        likes: _count.likes,
        artists: artists.map(({ id, name, avatar }) => ({
          id,
          name,
          avatar: asImageSizes(avatar),
        })),
        albums: albums.map(({ album }) => ({
          id: album.id,
          name: album.name,
        })),
      };
    }) ?? null,
});

export const mapArtistRawToMediaCard = (raw: ArtistContentRaw): ArtistCard => ({
  type: "artists",
  id: raw.id,
  title: raw.name,
  image: asImageSizes(raw.avatar),
  href: `/artists/${raw.id}`,
  tracks:
    raw.tracks?.map((track) => {
      const { cover, _count, artists, albums, ...rest } = track;
      return {
        ...rest,
        cover: asImageSizes(cover),
        likes: _count.likes,
        artists: artists.map(({ id, name, avatar }) => ({
          id,
          name,
          avatar: asImageSizes(avatar),
        })),
        albums: albums.map(({ album }) => ({
          id: album.id,
          name: album.name,
        })),
      };
    }) ?? null,
});

export const mapPlaylistRawToMediaCard = (raw: PlaylistContentRaw): PlaylistCard => ({
  type: "playlists",
  id: raw.id,
  title: raw.name,
  image: asImageSizes(raw.cover),
  images:
    raw.tracks
      ?.map((t) => asImageSizes(t.track.cover))
      .filter((c): c is ImageSizes => c !== null) ?? null,
  href: `/playlists/${raw.id}`,
  user: { username: raw.user.username, name: raw.user.displayUsername, avatar: raw.user.avatar },
  tracks:
    raw.tracks?.map(({ track }) => {
      const { cover, _count, artists, albums, ...rest } = track;
      return {
        ...rest,
        cover: asImageSizes(cover),
        likes: _count.likes,
        artists: artists.map(({ id, name, avatar }) => ({
          id,
          name,
          avatar: asImageSizes(avatar),
        })),
        albums: albums.map(({ album }) => ({
          id: album.id,
          name: album.name,
        })),
      };
    }) ?? null,
});
