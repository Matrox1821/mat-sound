import { NextRequest } from "next/server";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { getSortedArtistTracks } from "@/shared/server/artist/artist.service";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = (req.nextUrl.searchParams.get("user_id") as string) || null;
    const sort = (req.nextUrl.searchParams.get("sort") as string) || "releaseDate";
    const order = (req.nextUrl.searchParams.get("order") as "desc" | "asc") || "desc";
    const limit = parseInt(req.nextUrl.searchParams.get("limit") as string) || 10;

    const response = await getSortedArtistTracks({ id, limit, order, sort, userId });

    return onSuccessRequest({
      httpStatusCode: 200,
      data: response,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
