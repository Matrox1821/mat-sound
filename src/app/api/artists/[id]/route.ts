import { onSuccessRequest, onThrowError } from "@/apiService";
import { mapArtist } from "@/shared/server/artist/artist.mapper";
import { getArtistById } from "@/shared/server/artist/artist.repository";
import { NextRequest } from "next/server";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = (req.nextUrl.searchParams.get("user_id") as string) || null;

    const artist = mapArtist(await getArtistById({ id, userId }));

    return onSuccessRequest({
      httpStatusCode: 200,
      data: artist,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
