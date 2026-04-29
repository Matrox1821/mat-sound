"use server";
import { prisma } from "@config/db";
import { TrackFull, trackFullSelect } from "@/shared/server/track/track.select";
import { AlbumCard, ArtistCard, MediaCard, PlaylistCard, TrackCard } from "@/types/content.types";
import {
  albumWithTracksSelect,
  artistWithTracksSelect,
  playlistWithTracksSelect,
  SearchEntity,
} from "./search.select";
import { JsonValue } from "@prisma/client/runtime/client";
import { ImageSizes } from "@/types/common.types";

interface RankedId {
  id: string;
  rank: number;
  priority: number;
}
const asImageSizes = (value: JsonValue): ImageSizes | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as unknown as ImageSizes;
};
export async function searchRepository(
  q: string,
  entity: SearchEntity = "all",
): Promise<MediaCard[]> {
  const searchPattern = `${q.replace(/\s+/g, " & ")}:*`;
  const ilikePattern = `%${q}%`;
  const startPattern = `${q}%`;
  const shouldSearch = (type: SearchEntity) => entity === "all" || entity === type;

  const [rankedTracks, rankedArtists, rankedAlbums, rankedPlaylists] = (await Promise.all([
    shouldSearch("tracks")
      ? prisma.$queryRaw`
      SELECT t.id,
        ts_rank(to_tsvector('simple', coalesce(t.name, '')), to_tsquery('simple', ${searchPattern})) AS rank,
        CASE
          WHEN t.name ILIKE ${q} THEN 10
          WHEN t.name ILIKE ${startPattern} THEN 9
          WHEN t.name ILIKE ${ilikePattern} THEN 5
          ELSE 0
        END AS priority
      FROM "track" t
      WHERE to_tsvector('simple', t.name) @@ to_tsquery('simple', ${searchPattern})
        OR t.name ILIKE ${ilikePattern}
      ORDER BY priority DESC, rank DESC
      LIMIT 5
    `
      : Promise.resolve([]),
    shouldSearch("artists")
      ? prisma.$queryRaw`
      SELECT a.id,
        ts_rank(to_tsvector('simple', coalesce(a.name, '')), to_tsquery('simple', ${searchPattern})) AS rank,
        CASE
          WHEN a.name ILIKE ${q} THEN 10
          WHEN a.name ILIKE ${startPattern} THEN 9
          WHEN a.name ILIKE ${ilikePattern} THEN 5
          ELSE 0
        END AS priority
      FROM "artist" a
      WHERE to_tsvector('simple', a.name) @@ to_tsquery('simple', ${searchPattern})
        OR a.name ILIKE ${ilikePattern}
      ORDER BY priority DESC, rank DESC
      LIMIT 5
    `
      : Promise.resolve([]),
    shouldSearch("albums")
      ? prisma.$queryRaw`
      SELECT al.id,
        ts_rank(to_tsvector('simple', coalesce(al.name, '')), to_tsquery('simple', ${searchPattern})) AS rank,
        CASE
          WHEN al.name ILIKE ${q} THEN 10
          WHEN al.name ILIKE ${startPattern} THEN 9
          WHEN al.name ILIKE ${ilikePattern} THEN 5
          ELSE 0
        END AS priority
      FROM "album" al
      WHERE to_tsvector('simple', al.name) @@ to_tsquery('simple', ${searchPattern})
        OR al.name ILIKE ${ilikePattern}
      ORDER BY priority DESC, rank DESC
      LIMIT 5
    `
      : Promise.resolve([]),
    shouldSearch("playlists")
      ? prisma.$queryRaw`
      SELECT p.id,
        ts_rank(to_tsvector('simple', coalesce(p.name, '')), to_tsquery('simple', ${searchPattern})) AS rank,
        CASE
          WHEN p.name ILIKE ${q} THEN 10
          WHEN p.name ILIKE ${startPattern} THEN 9
          WHEN p.name ILIKE ${ilikePattern} THEN 5
          ELSE 0
        END AS priority
      FROM "playlist" p
      WHERE to_tsvector('simple', p.name) @@ to_tsquery('simple', ${searchPattern})
        OR p.name ILIKE ${ilikePattern}
      ORDER BY priority DESC, rank DESC
      LIMIT 5
    `
      : Promise.resolve([]),
  ])) as [RankedId[], RankedId[], RankedId[], RankedId[]];

  // 2. Prisma trae los datos completos con trackFullSelect
  const [tracks, artists, albums, playlists] = await Promise.all([
    prisma.track.findMany({
      where: { id: { in: rankedTracks.map((r) => r.id) } },
      select: trackFullSelect,
    }),

    prisma.artist.findMany({
      where: { id: { in: rankedArtists.map((r) => r.id) } },
      select: artistWithTracksSelect,
    }),

    prisma.album.findMany({
      where: { id: { in: rankedAlbums.map((r) => r.id) } },
      select: albumWithTracksSelect,
    }),

    prisma.playlist.findMany({
      where: { id: { in: rankedPlaylists.map((r) => r.id) } },
      select: playlistWithTracksSelect,
    }),
  ]);

  // 3. Mapeo a MediaCard conservando el ranking
  const rankMap = (ranked: RankedId[]) =>
    Object.fromEntries(
      ranked.map((r) => [r.id, { rank: Number(r.rank), priority: Number(r.priority) }]),
    );

  const trackRanks = rankMap(rankedTracks);
  const artistRanks = rankMap(rankedArtists);
  const albumRanks = rankMap(rankedAlbums);
  const playlistRanks = rankMap(rankedPlaylists);

  const mapTrack = (t: TrackFull) => ({
    id: t.id,
    name: t.name,
    cover: t.cover as any,
    song: t.song,
    duration: t.duration,
    reproductions: t.reproductions,
    releaseDate: t.releaseDate,
    likes: t._count.likes,
    lyrics: t.lyrics,
    artists: t.artists.map((a) => ({ ...a, avatar: a.avatar as any })),
    albums: t.albums.map((al) => ({ id: al.album.id, name: al.album.name })),
  });

  const mappedTracks: (TrackCard & RankedId)[] = tracks.map((t) => ({
    type: "tracks",
    title: t.name,
    href: `/tracks/${t.id}`,
    image: t.cover as any,
    ...mapTrack(t),
    ...trackRanks[t.id],
  }));

  const mappedArtists: (ArtistCard & RankedId)[] = artists.map((a) => ({
    type: "artists",
    id: a.id,
    title: a.name,
    href: `/artists/${a.id}`,
    image: a.avatar as any,
    tracks: a.tracks ? a.tracks.map(mapTrack) : null,
    ...artistRanks[a.id],
  }));

  const mappedAlbums: (AlbumCard & RankedId)[] = albums.map((al) => ({
    type: "albums",
    id: al.id,
    title: al.name,
    href: `/albums/${al.id}`,
    image: al.cover as any,
    releaseDate: al.releaseDate.toISOString(),
    artists: al.artists.map((a) => ({ ...a, avatar: a.avatar as any })),
    tracks: al.tracks.map(({ track }) => mapTrack(track)),
    ...albumRanks[al.id],
  }));

  const mappedPlaylists: (PlaylistCard & RankedId)[] = playlists.map((p) => ({
    type: "playlists",
    id: p.id,
    title: p.name,
    href: `/playlists/${p.id}`,
    image: p.cover as any,
    images: p.tracks
      .map(({ track }) => asImageSizes(track.cover))
      .filter((img): img is ImageSizes => img !== null)
      .slice(0, 4),
    user: { ...p.user, avatar: p.user.avatar ?? null },
    tracks: p.tracks.map(({ track }) => mapTrack(track)),
    ...playlistRanks[p.id],
  }));

  return [...mappedTracks, ...mappedArtists, ...mappedAlbums, ...mappedPlaylists];
}
