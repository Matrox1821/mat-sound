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
    SELECT 
      al.id, 
      al.name, 
      al.cover AS image, 
      'album' AS type,
      ts_rank(to_tsvector('simple', coalesce(al.name, '')), to_tsquery('simple', ${searchPattern})) AS rank,
      CASE
        WHEN al.name ILIKE ${q} THEN 10
        WHEN al.name ILIKE ${startPattern} THEN 9
        WHEN al.name ILIKE ${ilikePattern} THEN 5
        ELSE 0
      END AS priority,
      (
        SELECT json_agg(json_build_object('id', ar.id, 'name', ar.name))
        FROM "_ArtistToAlbum" ata -- Prisma suele nombrar relaciones M:N en orden alfabetico
        JOIN "artist" ar ON ar.id = ata."A" -- 'artist' en minusculas por el @@map
        WHERE ata."B" = al.id
      ) AS artists,
      (
        SELECT json_agg(ordered_tracks) FROM (
          SELECT tr.id, tr.name, tr.cover AS image
          FROM "track_on_album" toa -- Cambio a snake_case por @@map
          JOIN "track" tr ON tr.id = toa.track_id -- Cambio a minusculas por @@map
          WHERE toa.album_id = al.id
          ORDER BY toa.order ASC
        ) ordered_tracks
      ) AS tracks,
      (
        SELECT json_agg(ordered_rec) FROM (
          SELECT rec.id, rec.name, rec.image 
          FROM (
            SELECT DISTINCT tr.id, tr.name, tr.cover AS image
            FROM "track" tr
            JOIN "_GenreToTrack" gtt ON tr.id = gtt."B"
            JOIN "_AlbumToGenre" atg ON atg."B" = gtt."A"
            WHERE atg."A" = al.id
              AND NOT EXISTS (
                SELECT 1 FROM "track_on_album" t_on_a 
                WHERE t_on_a.track_id = tr.id AND t_on_a.album_id = al.id
              )
          ) rec
          ORDER BY RANDOM()
          LIMIT 5
        ) ordered_rec
      ) AS recommendations
    FROM "album" al -- Cambio a minusculas por @@map
    WHERE to_tsvector('simple', al.name) @@ to_tsquery('simple', ${searchPattern})
       OR al.name ILIKE ${ilikePattern}
  )
  SELECT * FROM main_results
  UNION ALL
  (
    SELECT al.id, al.name, al.cover AS image, 'album' AS type, 0 AS rank, -1 AS priority,
    (
      SELECT json_agg(json_build_object('id', ar.id, 'name', ar.name))
      FROM "_ArtistToAlbum" ata
      JOIN "artist" ar ON ar.id = ata."A"
      WHERE ata."B" = al.id
    ) AS artists,
    (
      SELECT json_agg(ordered_tracks) FROM (
        SELECT tr.id, tr.name, tr.cover AS image
        FROM "track_on_album" toa
        JOIN "track" tr ON tr.id = toa.track_id
        WHERE toa.album_id = al.id
        ORDER BY toa.order ASC
      ) ordered_tracks
    ) AS tracks,
    (
      SELECT json_agg(ordered_rec) FROM (
        SELECT rec.id, rec.name, rec.image 
        FROM (
          SELECT DISTINCT tr.id, tr.name, tr.cover AS image
          FROM "track" tr
          JOIN "_GenreToTrack" gtt ON tr.id = gtt."B"
          JOIN "_AlbumToGenre" atg ON atg."B" = gtt."A"
          WHERE atg."A" = al.id
            AND NOT EXISTS (
              SELECT 1 FROM "track_on_album" t_on_a 
              WHERE t_on_a.track_id = tr.id AND t_on_a.album_id = al.id
            )
        ) rec
        ORDER BY RANDOM()
        LIMIT 5
      ) ordered_rec
    ) AS recommendations
    FROM "album" al
    WHERE al.id NOT IN (SELECT id FROM main_results)
    ORDER BY RANDOM()
    LIMIT 25
  )
  ORDER BY priority DESC, rank DESC LIMIT 25
`) as any[];

    const combined = albums
      .sort((a, b) => b.priority - a.priority || b.rank - a.rank)
      .slice(0, 15)
      .map((item) => {
        delete item.priority;
        delete item.rank;
        return item;
      });

    return onSuccessRequest({
      httpStatusCode: 200,
      data: combined,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
