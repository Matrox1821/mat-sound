import { AlbumSearchParams, ParsedAlbumSearchParams } from "@/types/album.types";
import { ArtistSearchParams, ParsedArtistSearchParams } from "@/types/artist.types";
import { ParsedTrackSearchParams, TrackSearchParams } from "@/types/track.types";

function parseCommonParams(params?: { page?: string; rows?: string }) {
  return {
    page: params?.page ? +params.page : 1,
    rows: params?.rows ? +params.rows : 6,
  };
}

export async function parseTrackSearchParams(
  data?: Promise<TrackSearchParams>,
): Promise<ParsedTrackSearchParams> {
  const params = await data;
  return {
    ...parseCommonParams(params),
    artistName: params?.artistNameFilter,
    albumName: params?.albumNameFilter,
    trackName: params?.trackNameFilter,
    noSong: params?.["no-song"] === "true",
    noImage: params?.["no-image"] === "true",
    noGenres: params?.["no-genres"] === "true",
    noReproductions: params?.["no-reproductions"] === "true",
    noLyrics: params?.["no-lyrics"] === "true",
    noArtist: params?.["no-artist"] === "true",
    noAlbum: params?.["no-album"] === "true",
  };
}
export async function parseArtistSearchParams(
  data?: Promise<ArtistSearchParams>,
): Promise<ParsedArtistSearchParams> {
  const params = await data;

  return {
    ...parseCommonParams(params),
    artistName: params?.artistNameFilter,
    noAvatar: params?.["no-avatar"] === "true",
    noMainCover: params?.["no-main-cover"] === "true",
    noDescription: params?.["no-description"] === "true",
    noIsVerified: params?.["no-is-verified"] === "true",
    noRegionalListeners: params?.["no-regional-listeners"] === "true",
    noSocials: params?.["no-socials"] === "true",
    noCovers: params?.["no-covers"] === "true",
    noAlbums: params?.["no-albums"] === "true",
    noTracks: params?.["no-tracks"] === "true",
  };
}
export async function parseAlbumSearchParams(
  data?: Promise<AlbumSearchParams>,
): Promise<ParsedAlbumSearchParams> {
  const params = await data;
  return {
    ...parseCommonParams(params),
    artistName: params?.artistNameFilter || undefined,
    albumName: params?.albumNameFilter || undefined,
    noCover: params?.["no-cover"] === "true",
    noArtists: params?.["no-artists"] === "true",
    noTracks: params?.["no-tracks"] === "true",
  };
}
