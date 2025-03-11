import { onSuccessRequest, onThrowError } from "@/apiService";
import prisma from "@/app/config/db";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { uploadFileToBucket } from "@/shared/files";
import {
  ARTIST_AVATAR_FILE_R2,
  ARTISTS_COVERS_FILE_R2,
} from "@/shared/constants";
import { createArtistInDatabase } from "@/shared/database";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const avatar_name_path = (ARTIST_AVATAR_FILE_R2 +
      formData.get("name")) as string;
    const body = {
      name: formData.get("name") as string,
      image: formData.get("image") as File,
      listeners: formData.get("listeners") as string,
      followers: formData.get("followers") as string,
      description: formData.get("description") as string,
      is_verified: formData.get("is_verified") as string,
      covers: formData.getAll("covers") as File[],
      regional_listeners: formData.get("regional_listeners") as string,
      socials: formData.get("socials") as string,
      avatar_name_path,
    };

    const isNewArtist = await prisma.artist.findFirst({
      where: { name: body.name },
    });

    if (isNewArtist)
      throw new CustomError({
        errors: [{ message: "Artist already exists." }],
        msg: "Artist already exists.",
        httpStatusCode: HttpStatusCode.CONFLICT,
      });

    const newArtist = await createArtistInDatabase(body);

    const avatarCreated = await uploadFileToBucket(
      body.image,
      avatar_name_path
    );

    const coversCreated = body.covers.map(
      async (cover) =>
        await uploadFileToBucket(cover, ARTISTS_COVERS_FILE_R2 + cover.name)
    );

    if (newArtist && (!avatarCreated || coversCreated.length === 0)) {
      await prisma.artist.delete({ where: { id: newArtist.id } });
    }

    return onSuccessRequest({
      httpStatusCode: 200,
      data: { artist: newArtist },
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
      data: { artists: artists },
    });
  } catch (error) {
    return onThrowError(error);
  }
}
