import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import prisma from "@/config/db";
import { onSuccessRequest, onThrowError } from "@/apiService";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response = await prisma.artist.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        image: true,
        page_cover: true,
        description: true,
        covers: true,
        is_verified: true,
        listeners: true,
        socials: true,
        regional_listeners: true,
        followers_default: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    return onSuccessRequest({
      httpStatusCode: 200,
      data: response,
    });
    /* if (!elements || elements.length === 0) {
      throw new CustomError({
        errors: [
          {
            message: "The search returned no results. No elements were found.",
          },
        ],
        msg: "The search returned no results. No elements were found.",
        httpStatusCode: HttpStatusCode.NOT_FOUND,
      });
    } */
  } catch (error) {
    return onThrowError(error);
  }
}
