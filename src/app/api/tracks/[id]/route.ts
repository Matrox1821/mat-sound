import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { getTrackById, getTracks } from "@/shared/server/track/trackRepository";
import { getUserPlaylists } from "@/shared/server/user/userRepository";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const limit = req.nextUrl.searchParams.get("limit");
    const userId = req.nextUrl.searchParams.get("user_id") || "";
    const userPlaylists = userId !== "" && (await getUserPlaylists({ userId }));
    if (limit) {
      const tracks = await getTracks(Number(limit), userId, { by: "tracks", id });

      if (!tracks) {
        throw new CustomError({
          errors: [
            {
              message: "The search returned no results. No elements were found.",
            },
          ],
          msg: "The search returned no results. No elements were found.",
          httpStatusCode: HttpStatusCode.NOT_FOUND,
        });
      }

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
    const response = await getTrackById({ trackId: id, userId });
    const newPlaylist =
      userPlaylists &&
      userPlaylists.playlists.map((playlist) => ({
        ...playlist,
        isInPlaylist: playlist.tracks.some(({ track }) => track.id === response.id),
      }));
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: {
        ...response,
        likes: response._count.likes,
        isLiked: response.likes && response.likes.length > 0,
        playlists: newPlaylist || null,
      },
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}
