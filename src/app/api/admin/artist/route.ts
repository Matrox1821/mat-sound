import { onSuccessRequest, onThrowError } from "@/apiService";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { createArtist } from "@/shared/server/artist/artistRepository";
import { parseArtistFormData } from "@/shared/formData/artistForm";
import { addImagePathsToArtist, checkArtistExists } from "@/shared/server/artist/artistService";
import {
  handleAvatarResizeAndUpload,
  uploadCovers,
  uploadMainCover,
} from "@/shared/server/artist/artistStorage";
import { rollbackArtistCreation } from "@/shared/server/artist/artistRollback";
import { prisma } from "@config/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = parseArtistFormData(formData);

    await checkArtistExists({ name: body.name });

    const newArtist = await createArtist(body);
    if (!newArtist)
      throw new CustomError({
        errors: [{ message: "The artist has not been created" }],
        msg: "The artist has not been created",
        httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    const { id } = newArtist;

    const mainCoverPath = await uploadMainCover(body.main_cover, id);
    const coversPath = await uploadCovers(body.covers, id);
    const { buffer, dbPath, r2Path, avatarUploads } = await handleAvatarResizeAndUpload(
      body.avatar,
      id
    );

    const artist = await addImagePathsToArtist({
      artistId: id,
      paths: {
        avatar: dbPath,
        covers: coversPath,
        mainCover: mainCoverPath,
      },
    });

    if (artist && (avatarUploads.length === 0 || coversPath.length === 0 || !mainCoverPath)) {
      await rollbackArtistCreation({
        artistId: id,
        buffer,
        r2Path,
        coversPath,
        covers: body.covers,
        mainCoverFile: body.main_cover,
        mainCoverPath,
      });
    }
    return onSuccessRequest({
      httpStatusCode: 200,
      data: artist,
    });
  } catch (error) {
    return onThrowError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { name: "asc" },
    });
    return onSuccessRequest({
      httpStatusCode: 200,
      data: artists,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
