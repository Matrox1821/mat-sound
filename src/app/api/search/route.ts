import { onSuccessRequest, onThrowError } from "@/apiService";
import { prisma } from "@config/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q || q.length < 1) {
      return NextResponse.json({ results: [] });
    }
    const searchPattern = `${q.replace(/\s+/g, " & ")}:*`;
    const ilikePattern = `%${q}%`;
    const startPattern = `${q}%`;

    const [tracks, artists, albums] = (await Promise.all([
      // TRACKS
      prisma.$queryRaw`
        SELECT t.id, t.name, t.cover AS image, 'track' AS type,
        ts_rank(to_tsvector('simple', coalesce(t.name, '')), to_tsquery('simple', ${searchPattern})) AS rank,
        CASE
          WHEN t.name ILIKE ${q} THEN 10
          WHEN t.name ILIKE ${startPattern} THEN 9
          WHEN t.name ILIKE ${ilikePattern} THEN 5
          ELSE 0
        END AS priority,
        (
          SELECT json_agg(json_build_object('id', ar.id, 'name', ar.name))
          FROM "TracksOnArtists" toa
          JOIN "Artist" ar ON ar.id = toa.artist_id
          WHERE toa.track_id = t.id
        ) AS artists,
        (
          SELECT json_agg(ordered_rec) FROM (
            SELECT rec.id, rec.name, rec.image 
            FROM (
              SELECT DISTINCT r.id, r.name, r.cover AS image
              FROM "Track" r
              LEFT JOIN "TrackGenre" tg_r ON r.id = tg_r.track_id
              LEFT JOIN "TrackGenre" tg_t ON tg_t.genre_id = tg_r.genre_id AND tg_t.track_id = t.id
              LEFT JOIN "TracksOnArtists" ta_r ON r.id = ta_r.track_id
              LEFT JOIN "TracksOnArtists" ta_t ON ta_t.artist_id = ta_r.artist_id AND ta_t.track_id = t.id
              WHERE r.id <> t.id 
                AND (tg_t.track_id IS NOT NULL OR ta_t.track_id IS NOT NULL)
            ) rec
            ORDER BY RANDOM()
            LIMIT 5
          ) ordered_rec
        ) AS tracks
        FROM "Track" t
        WHERE to_tsvector('simple', t.name) @@ to_tsquery('simple', ${searchPattern})
          OR t.name ILIKE ${ilikePattern}
        ORDER BY priority DESC, rank DESC LIMIT 5
      `,

      // ARTISTS
      prisma.$queryRaw`
        SELECT a.id, a.name, a.avatar AS image, 'artist' AS type,
        ts_rank(to_tsvector('simple', coalesce(a.name, '')), to_tsquery('simple', ${searchPattern})) AS rank,
        CASE
          WHEN a.name ILIKE ${q} THEN 10
          WHEN a.name ILIKE ${startPattern} THEN 9
          WHEN a.name ILIKE ${ilikePattern} THEN 5
          ELSE 0
        END AS priority,
        (
          SELECT json_agg(t_sub) FROM (
            SELECT tr.id, tr.name, tr.cover AS image
            FROM "Track" tr
            JOIN "TracksOnArtists" toa ON toa.track_id = tr.id
            WHERE toa.artist_id = a.id
            ORDER BY tr.reproductions DESC
            LIMIT 5
          ) t_sub
        ) AS tracks
        FROM "Artist" a
        WHERE to_tsvector('simple', a.name) @@ to_tsquery('simple', ${searchPattern})
          OR a.name ILIKE ${ilikePattern}
        ORDER BY priority DESC, rank DESC LIMIT 5
      `,

      // ALBUMS
      prisma.$queryRaw`
        SELECT al.id, al.name, al.cover AS image, 'album' AS type,
        ts_rank(to_tsvector('simple', coalesce(al.name, '')), to_tsquery('simple', ${searchPattern})) AS rank,
        CASE
          WHEN al.name ILIKE ${q} THEN 10
          WHEN al.name ILIKE ${startPattern} THEN 9
          WHEN al.name ILIKE ${ilikePattern} THEN 5
          ELSE 0
        END AS priority,
        (
          SELECT json_agg(json_build_object('id', ar.id, 'name', ar.name))
          FROM "AlbumsOnArtists" aoa
          JOIN "Artist" ar ON ar.id = aoa.artist_id
          WHERE aoa.album_id = al.id
        ) AS artists,
        (
          SELECT json_agg(ordered_tracks) FROM (
            SELECT tr.id, tr.name, tr.cover AS image
            FROM "TracksOnAlbums" toa
            JOIN "Track" tr ON tr.id = toa.track_id
            WHERE toa.album_id = al.id
            ORDER BY toa.order ASC
          ) ordered_tracks
        ) AS tracks,
        (
          SELECT json_agg(ordered_rec) FROM (
            SELECT rec.id, rec.name, rec.image 
            FROM (
              SELECT DISTINCT tr.id, tr.name, tr.cover AS image
              FROM "Track" tr
              JOIN "TrackGenre" tg ON tr.id = tg.track_id
              JOIN "AlbumGenre" ag ON ag.genre_id = tg.genre_id
              WHERE ag.album_id = al.id
                AND NOT EXISTS (
                  SELECT 1 FROM "TracksOnAlbums" t_on_a 
                  WHERE t_on_a.track_id = tr.id AND t_on_a.album_id = al.id
                )
            ) rec
            ORDER BY RANDOM()
            LIMIT 5
          ) ordered_rec
        ) AS recommendations
        FROM "Album" al
        WHERE to_tsvector('simple', al.name) @@ to_tsquery('simple', ${searchPattern})
          OR al.name ILIKE ${ilikePattern}
        ORDER BY priority DESC, rank DESC LIMIT 5
      `,
    ])) as any[][];

    const combined = [...artists, ...tracks, ...albums]
      .sort((a, b) => {
        // 1) Artistas primero
        if (a.type === "artist" && b.type !== "artist") return -1;
        if (b.type === "artist" && a.type !== "artist") return 1;
        // 2) Prioridad
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        // 3) Rank (más relevante primero)
        return b.rank - a.rank;
      })
      .slice(0, 15)
      .map(({ priority, rank, ...rest }) => rest);

    return onSuccessRequest({
      httpStatusCode: 200,
      data: combined,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
