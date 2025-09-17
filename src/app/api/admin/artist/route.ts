import { onSuccessRequest, onThrowError } from "@/apiService";
import prisma from "@/config/db";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import { uploadFileToBucket } from "@/shared/files";
import { createArtistInDatabase } from "@/shared/database";
import { formatR2FilePath } from "@/shared/helpers";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const artistName = formData.get("name") as string;
    const avatar_path = formatR2FilePath({
      type: "avatar",
      root: "artists",
      artistName,
    });
    const page_cover_path = formatR2FilePath({
      type: "pageCover",
      root: "artists",
      artistName,
    });
    const covers = formData.getAll("covers") as File[];
    const covers_path = covers.map((_, i) =>
      formatR2FilePath({
        type: "covers",
        artistName,
        root: "artists",
        fileName: "cover-" + (i + 1),
      })
    );
    const body = {
      name: formData.get("name") as string,
      image: formData.get("image") as File,
      page_cover: formData.get("page_cover") as File,
      listeners: formData.get("listeners") as string,
      followers: formData.get("followers") as string,
      description: formData.get("description") as string,
      is_verified: formData.get("is_verified") as string,
      regional_listeners: formData.get("regional_listeners") as string,
      socials: formData.get("socials") as string,
      covers_path,
      avatar_path,
      page_cover_path,
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

    const avatarCreated = await uploadFileToBucket(body.image, avatar_path);
    const pageCoverCreated = await uploadFileToBucket(body.page_cover, page_cover_path);

    const coversCreated = covers.map(
      async (cover, i) => await uploadFileToBucket(cover, covers_path[i])
    );

    if (newArtist && (!avatarCreated || coversCreated.length === 0 || !pageCoverCreated)) {
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
