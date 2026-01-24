import { onSuccessRequest, onThrowError } from "@/apiService";
import { CustomError } from "@/types/error.type";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { createArtist } from "@/shared/server/artist/artist.repository";
import { parseArtistFormData, parseUpdateArtistFormData } from "@/shared/formData/artistForm";
import {
  addImagePathsToArtist,
  validateArtistUniqueness,
} from "@/shared/server/artist/artist.service";
import {
  handleAvatarResizeAndUpload,
  uploadCovers,
  uploadMainCover,
} from "@/shared/server/artist/artist.storage";
import { rollbackArtistCreation } from "@/shared/server/artist/artist.rollback";
import { prisma } from "@config/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = parseArtistFormData(formData);
    await validateArtistUniqueness({ name: body.name });

    const newArtist = await createArtist(body);
    if (!newArtist)
      throw new CustomError({
        errors: [{ message: "The artist has not been created" }],
        msg: "The artist has not been created",
        httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    const { id } = newArtist;

    const avatar = body.avatar && (await handleAvatarResizeAndUpload(body.avatar, id));

    const mainCoverPath = body.mainCover && (await uploadMainCover(body.mainCover, id));
    const coversPath =
      body.covers && body.covers?.length > 0 && (await uploadCovers(body.covers, id));

    const artist = await addImagePathsToArtist({
      artistId: id,
      paths: {
        avatar: avatar ? avatar.dbPath : null,
        covers: coversPath || null,
        mainCover: mainCoverPath || null,
      },
    });

    if (
      artist &&
      (avatar?.avatarUploads.length === 0 ||
        (coversPath && coversPath?.length === 0) ||
        !mainCoverPath)
    ) {
      await rollbackArtistCreation({
        artistId: id,
        buffer: avatar ? avatar.buffer : null,
        r2Path: avatar ? avatar.r2Path : null,
        coversPath: coversPath || null,
        covers: body.covers,
        mainCoverFile: body.mainCover,
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
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("search");
    const artists = await prisma.artist.findMany({
      where: searchTerm
        ? {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          }
        : {},
      orderBy: { name: "asc" },
      take: searchTerm ? 15 : undefined,
    });

    return onSuccessRequest({
      httpStatusCode: 200,
      data: artists,
    });
  } catch (error) {
    console.error("Error fetching artists:", error);
    return onThrowError(error);
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const { id, avatar, covers, mainCover, followers, ...data } =
      parseUpdateArtistFormData(formData);
    if (!id) return;
    const mainCoverPath = await uploadMainCover(mainCover, id);
    const coversPath = await uploadCovers(covers, id);
    const avatarResized = await handleAvatarResizeAndUpload(avatar, id);

    await addImagePathsToArtist({
      artistId: id,
      paths: {
        avatar: avatarResized.dbPath,
        covers: coversPath,
        mainCover: mainCoverPath,
      },
    });

    await prisma.artist.update({
      where: { id },
      data: { ...data, followersDefault: followers },
    });

    return onSuccessRequest({
      httpStatusCode: 200,
      data: null,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
