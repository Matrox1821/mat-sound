import { onSuccessRequest, onThrowError } from "@/apiService";
import { albumBulkSchema } from "@/shared/utils/schemas/bulkValidations";
import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { prisma } from "@config/db";
import { NextRequest } from "next/server";
import z from "zod";

const requestSchema = z.object({
  artistId: z.string().min(10, "El id del artista es obligatorio"),
  albums: z.array(albumBulkSchema).min(1, "Debes incluir al menos un álbum"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      throw new CustomError({
        errors: validation.error.issues,
        msg: "Invalid data format",
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
      });
    }
    const { artistId, albums } = validation.data;
    const results = await Promise.all(
      albums.map(async (album) => {
        const albumExist = await prisma.album.findFirst({
          where: { name: album.name, artists: { some: { id: artistId } } },
        });
        if (albumExist) return;
        return prisma.album.create({
          data: {
            name: album.name,
            releaseDate: new Date(album.releaseDate),
            artists: {
              connect: { id: artistId },
            },
          },
        });
      }),
    );

    if (results.length === 0) {
      throw new CustomError({
        errors: [{ message: "No artists were created" }],
        msg: "The artists have not been created",
        httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    return onSuccessRequest({
      httpStatusCode: 200,
      data: "results",
    });
  } catch (error) {
    return onThrowError(error);
  }
}
