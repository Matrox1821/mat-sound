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
      SELECT 
        t.id, 
        t.name, 
        t.cover AS image,
        ts_rank(to_tsvector('simple', coalesce(t.name, '')), to_tsquery('simple', ${searchPattern})) AS rank,
        CASE
          WHEN t.name ILIKE ${q} THEN 10
          WHEN t.name ILIKE ${startPattern} THEN 9
          WHEN t.name ILIKE ${ilikePattern} THEN 5
          ELSE 0
        END AS priority,
        (
          SELECT json_agg(json_build_object('id', ar.id, 'name', ar.name))
          FROM "_ArtistToTrack" att
          JOIN "artist" ar ON ar.id = att."A" -- 'artist' en minúsculas
          WHERE att."B" = t.id
        ) AS artists,
        (
          SELECT json_agg(ordered_rec) FROM (
            SELECT rec.id, rec.name, rec.image 
            FROM (
              SELECT DISTINCT r.id, r.name, r.cover AS image
              FROM "track" r -- 'track' en minúsculas
              LEFT JOIN "_GenreToTrack" gtr_r ON r.id = gtr_r."B"
              LEFT JOIN "_GenreToTrack" gtr_t ON gtr_t."A" = gtr_r."A" AND gtr_t."B" = t.id
              LEFT JOIN "_ArtistToTrack" att_r ON r.id = att_r."B"
              LEFT JOIN "_ArtistToTrack" att_t ON att_t."A" = att_r."A" AND att_t."B" = t.id
              WHERE r.id <> t.id 
                AND (gtr_t."B" IS NOT NULL OR att_t."B" IS NOT NULL)
            ) rec
            ORDER BY RANDOM()
            LIMIT 5
          ) ordered_rec
        ) AS tracks
      FROM "track" t -- 'track' en minúsculas
      WHERE to_tsvector('simple', t.name) @@ to_tsquery('simple', ${searchPattern})
         OR t.name ILIKE ${ilikePattern}
    )
    SELECT * FROM main_results
    UNION ALL
    (
      SELECT t.id, t.name, t.cover AS image, 0 AS rank, -1 AS priority,
      (
        SELECT json_agg(json_build_object('id', ar.id, 'name', ar.name))
        FROM "_ArtistToTrack" att
        JOIN "artist" ar ON ar.id = att."A"
        WHERE att."B" = t.id
      ) AS artists,
      (
        SELECT json_agg(ordered_rec) FROM (
          SELECT rec.id, rec.name, rec.image 
          FROM (
            SELECT DISTINCT r.id, r.name, r.cover AS image
            FROM "track" r
            LEFT JOIN "_GenreToTrack" gtr_r ON r.id = gtr_r."B"
            LEFT JOIN "_GenreToTrack" gtr_t ON gtr_t."A" = gtr_r."A" AND gtr_t."B" = t.id
            LEFT JOIN "_ArtistToTrack" att_r ON r.id = att_r."B"
            LEFT JOIN "_ArtistToTrack" att_t ON att_t."A" = att_r."A" AND att_t."B" = t.id
            WHERE r.id <> t.id 
              AND (gtr_t."B" IS NOT NULL OR att_t."B" IS NOT NULL)
          ) rec
          ORDER BY RANDOM()
          LIMIT 5
        ) ordered_rec
      ) AS tracks
      FROM "track" t
      WHERE t.id NOT IN (SELECT id FROM main_results)
      ORDER BY RANDOM()
      LIMIT 25
    )
    ORDER BY priority DESC, rank DESC LIMIT 25
  `) as any[];

    const combined = tracks
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
