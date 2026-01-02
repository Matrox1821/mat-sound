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
    const albums = (await prisma.$queryRaw`
      WITH main_results AS (
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
    )
    SELECT * FROM main_results
    UNION ALL
    (
      SELECT al.id, al.name, al.cover AS image, 'album' AS type, 0 AS rank, -1 AS priority,
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
      WHERE al.id NOT IN (SELECT id FROM main_results)
      ORDER BY RANDOM()
      LIMIT 25
    )
    ORDER BY priority DESC, rank DESC LIMIT 25
    `) as any[];

    const combined = albums
      .sort((a, b) => {
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
