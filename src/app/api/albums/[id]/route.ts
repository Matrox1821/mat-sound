import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { onSuccessRequest, onThrowError } from "@/apiService";
import { getAlbumById } from "@/shared/server/album/album.repository";
import { getRandomTracksIds, getTracksByIds } from "@/shared/server/track/track.repository";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const album = await getAlbumById(id);

    if (!album) {
      throw new CustomError({
        errors: [
          {
            message: `Album with ID ${id} was not found in our records.`,
          },
        ],
        msg: "Resource not found",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    }

    const tracksIds = album.tracks.map(({ track }) => track.id);

    const recommendedTracksIds = await getRandomTracksIds(20, tracksIds);

    const recommendedTracks = await getTracksByIds({
      trackIds: recommendedTracksIds.map(({ id }) => id),
    });

    return onSuccessRequest({
      httpStatusCode: 200,
      data: { album, recommendedTracks },
    });
  } catch (error) {
    console.log(error);
    return onThrowError(error);
  }
}
