import {
  ArtistTracksRepository,
  ArtistRepository,
  ArtistServer,
  ArtistTracks,
} from "@shared-types/artist.types";
import { TrackById } from "@shared-types/track.types";

export const mapArtistTracks = (
  rawData: ArtistTracksRepository[] | TrackById[],
): ArtistTracks[] => {
  return rawData.map(({ _count, albums, ...track }) => ({
    ...track,
    likes: _count.likes,
    albums: albums.map(({ album }) => album),
  }));
};

export const mapArtist = (artist: ArtistRepository | null): ArtistServer | null => {
  if (!artist) return null;
  const { _count, followersDefault, followers, ...newArtist } = artist;
  return { ...newArtist, followers: followersDefault + _count.followers, isFollowing: !!followers };
};
