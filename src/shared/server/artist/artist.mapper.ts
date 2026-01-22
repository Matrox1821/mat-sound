import {
  ArtistTracksRepository,
  ArtistTracks,
  ArtistRepository,
  ArtistServer,
} from "@/types/artist.types";

export const mapArtistTracks = (rawData: ArtistTracksRepository[]): ArtistTracks[] => {
  return rawData.map(({ _count, likes, albums, ...track }) => ({
    ...track,
    isLiked: !!likes,
    likes: _count.likes,
    albums: albums.map(({ album }) => album),
  }));
};

export const mapArtist = (artist: ArtistRepository | null): ArtistServer | null => {
  if (!artist) return null;
  const { _count, followersDefault, followers, ...newArtist } = artist;
  return { ...newArtist, followers: followersDefault + _count.followers, isFollowing: !!followers };
};
