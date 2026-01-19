import { onSuccessRequest, onThrowError } from "@/apiService";
import { artistIsExists } from "@/shared/server/artist/artist.repository";
import { artistBulkSchema } from "@/shared/utils/schemas/bulkValidations";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { prisma } from "@config/db";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = z.array(artistBulkSchema).safeParse(body);

    if (!validation.success) {
      throw new CustomError({
        errors: validation.error.issues,
        msg: "Invalid data format",
        httpStatusCode: HttpStatusCode.BAD_REQUEST,
      });
    }

    const results = await Promise.all(
      validation.data.map(async (artist) => {
        const artistExist = await artistIsExists({ name: artist.name });
        if (artistExist) return;
        return prisma.artist.create({
          data: {
            name: artist.name,
            description: artist.description,
            listeners: artist.listeners,
            isVerified: artist.isVerified,
            followersDefault: artist.followers,
            genres: {
              connectOrCreate: artist.genres.map((genreName) => ({
                where: { name: genreName },
                create: { name: genreName },
              })),
            },
          },
        });
      })
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
      data: results,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
