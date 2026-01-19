import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { getUserPlaylists } from "@/shared/server/user/user.repository";
import { getTrackWithRecommendationsService } from "@/shared/server/track/track.service";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const limit = req.nextUrl.searchParams.get("limit");
    const userId = req.nextUrl.searchParams.get("user_id") || "";
    const userPlaylists = userId !== "" && (await getUserPlaylists({ userId }));
    if (limit) {
      const tracks = await getTrackWithRecommendationsService({
        limit: Number(limit),
        trackIds: [id],
        userId,
      });

      return onSuccessRequest({
        httpStatusCode: HttpStatusCode.OK,
        data: tracks.map((track) => {
          if (!userPlaylists) return track;

          return {
            ...track,
            playlists: userPlaylists.playlists.map((playlist) => ({
              ...playlist,
              isInPlaylist: playlist.tracks.some(
                ({ track: playlistTrack }) => playlistTrack.id === track.id
              ),
            })),
          };
        }),
      });
    }
    /* let trackResponse; */
    const response = await getTrackWithRecommendationsService({ limit: 1, trackIds: [id], userId });

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: response,
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}
