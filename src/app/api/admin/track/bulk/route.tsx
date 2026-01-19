import { onSuccessRequest, onThrowError } from "@/apiService";
import { trackBulkSchema } from "@/shared/utils/schemas/bulkValidations";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { prisma } from "@config/db";
import { NextRequest } from "next/server";
import z from "zod";

// Validamos el cuerpo de la petición que incluye los IDs de relación
const requestSchema = z.object({
  artistId: z.string().uuid("ID de artista inválido"),
  albumId: z.string().uuid("ID de álbum inválido"),
  tracks: z.array(trackBulkSchema).min(1, "Debes incluir al menos un track"),
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

    const { artistId, albumId, tracks } = validation.data;

    const results = await prisma.$transaction(async (tx) => {
      const createdTracks = [];

      for (const track of tracks) {
        const existingTrack = await tx.track.findFirst({
          where: {
            name: track.name,
          },
        });

        if (existingTrack) {
          console.log(`Track "${track.name}" ya existe, saltando...`);
          continue;
        }

        const newTrack = await tx.track.create({
          data: {
            name: track.name,
            releaseDate: new Date(track.releaseDate),
            duration: track.duration,
            reproductions: track.reproductions,
            artists: {
              connect: [{ id: artistId }],
            },
            genres: {
              connectOrCreate: track.genres.map((genreName) => ({
                where: { name: genreName },
                create: { name: genreName },
              })),
            },
            albums: {
              create: {
                albumId: albumId,
                order: track.order,
                disk: track.disk,
              },
            },
          },
        });
        createdTracks.push(newTrack);
      }

      return createdTracks;
    });

    if (results.length === 0) {
      return onSuccessRequest({
        httpStatusCode: 200,
        data: "No new tracks were created (all existed already)",
      });
    }

    return onSuccessRequest({
      httpStatusCode: 200,
      data: `${results.length} tracks processed successfully`,
    });
  } catch (error) {
    return onThrowError(error);
  }
}