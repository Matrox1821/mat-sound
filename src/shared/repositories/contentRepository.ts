import prisma from "@/config/db";

export const fetchTracks = async (
  limit: number,
  filter?: { by: "artists" | "tracks" | "albums" | "playlists" | "none"; id: string }
) => {
  let findBy = {};
  if (filter?.by === "artists") {
    findBy = {
      ...findBy,
      artists: {
        every: {
          artist_id: filter.id,
        },
      },
    };
  }
  const tracks = await prisma.track.findMany({
    take: limit,
    where: findBy,
    select: {
      id: true,
      name: true,
      image: true,
      song: true,
      duration: true,
      reproductions: true,
      release_date: true,
      _count: { select: { likes: true } },
      artists: { select: { artist: { select: { name: true, id: true, image: true } } } },
      albums: { select: { order_in_album: true, album: { select: { id: true, name: true } } } },
    },
  });
  return tracks.map((track) => ({ ...track, type: "tracks" }));
};

export const fetchAlbums = async (
  limit: number,
  filter?: { by: "artists" | "tracks" | "albums" | "playlists" | "none"; id: string }
) => {
  let findBy = {};
  if (filter?.by === "artists") {
    findBy = {
      artist_id: filter.id,
    };
  }

  const albums = await prisma.album.findMany({
    take: limit,
    where: findBy,
    select: {
      id: true,
      name: true,
      image: true,
      artist: { select: { name: true, id: true, image: true } },
    },
  });
  return albums.map((album) => ({ ...album, type: "albums" }));
};

export const fetchArtists = async (limit: number) => {
  const artists = await prisma.artist.findMany({
    take: limit,
    select: { id: true, name: true, image: true },
  });
  return artists.map((artist) => ({ ...artist, type: "artists" }));
};

export const fetchPlaylists = async (limit: number) => {
  const playlists = await prisma.playlist.findMany({
    take: limit,
    select: { id: true, name: true, images: true },
  });
  return playlists.map((playlist) => ({ ...playlist, type: "playlists" }));
};
