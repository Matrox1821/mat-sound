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
      // 1. TRACKS
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
      FROM "_ArtistToTrack" att
      JOIN "artist" ar ON ar.id = att."A"
      WHERE att."B" = t.id
    ) AS artists
    FROM "track" t
    WHERE to_tsvector('simple', t.name) @@ to_tsquery('simple', ${searchPattern})
      OR t.name ILIKE ${ilikePattern}
    ORDER BY priority DESC, rank DESC LIMIT 5
  `,

      // 2. ARTISTS
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
        FROM "track" tr
        JOIN "_ArtistToTrack" att ON att."B" = tr.id
        WHERE att."A" = a.id
        ORDER BY tr.reproductions DESC
        LIMIT 5
      ) t_sub
    ) AS tracks
    FROM "artist" a
    WHERE to_tsvector('simple', a.name) @@ to_tsquery('simple', ${searchPattern})
      OR a.name ILIKE ${ilikePattern}
    ORDER BY priority DESC, rank DESC LIMIT 5
  `,

      // 3. ALBUMS
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
    ) AS tracks
    FROM "album" al
    WHERE to_tsvector('simple', al.name) @@ to_tsquery('simple', ${searchPattern})
      OR al.name ILIKE ${ilikePattern}
    ORDER BY priority DESC, rank DESC LIMIT 5
  `,
    ])) as any[][];

    const combined = [...artists, ...tracks, ...albums]
      .sort((a, b) => {
        if (a.type === "artist" && b.type !== "artist") return -1;
        if (b.type === "artist" && a.type !== "artist") return 1;
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.rank - a.rank;
      })
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
