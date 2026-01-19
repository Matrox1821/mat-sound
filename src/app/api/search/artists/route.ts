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
    const artists = (await prisma.$queryRaw`
  WITH main_results AS (
    SELECT 
      a.id, 
      a.name, 
      a.avatar AS image,
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
          FROM "track" tr -- Minúsculas por @@map("track")
          JOIN "_ArtistToTrack" att ON att."B" = tr.id
          WHERE att."A" = a.id
          ORDER BY tr.reproductions DESC
          LIMIT 5
        ) t_sub
      ) AS tracks
    FROM "artist" a -- Minúsculas por @@map("artist")
    WHERE to_tsvector('simple', a.name) @@ to_tsquery('simple', ${searchPattern})
       OR a.name ILIKE ${ilikePattern}
  )
  SELECT * FROM main_results
  UNION ALL
  (
    SELECT 
      art.id, 
      art.name, 
      art.avatar AS image, 
      0 AS rank, 
      -1 AS priority,
      (
        SELECT json_agg(t_sub) FROM (
          SELECT tr.id, tr.name, tr.cover AS image
          FROM "track" tr
          JOIN "_ArtistToTrack" att ON att."B" = tr.id
          WHERE att."A" = art.id
          ORDER BY tr.reproductions DESC
          LIMIT 5
        ) t_sub
      ) AS tracks
    FROM "artist" art
    WHERE art.id NOT IN (SELECT id FROM main_results)
    ORDER BY RANDOM()
    LIMIT 25
  )
  ORDER BY priority DESC, rank DESC LIMIT 25
`) as any[];
    const combined = artists
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
