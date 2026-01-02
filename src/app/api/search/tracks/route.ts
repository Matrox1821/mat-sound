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
    const tracks = (await prisma.$queryRaw`
    WITH main_results AS (
      SELECT t.id, t.name, t.cover AS image,
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
    )
    SELECT * FROM main_results
    UNION ALL
    (
      SELECT t.id, t.name, t.cover AS image, 0 AS rank, -1 AS priority,
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
      WHERE t.id NOT IN (SELECT id FROM main_results)
      ORDER BY RANDOM()
      LIMIT 25
    )
    ORDER BY priority DESC, rank DESC LIMIT 25
  `) as any[];

    const combined = tracks
      .sort((a, b) => {
        // 2) Prioridad
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        // 3) Rank (más relevante primero)
        return b.rank - a.rank;
      })
      .map(({ priority, rank, ...rest }) => rest);

    return onSuccessRequest({
      httpStatusCode: 200,
      data: combined,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
