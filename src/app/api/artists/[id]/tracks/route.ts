import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";
import prisma from "@/config/db";
import { onSuccessRequest, onThrowError } from "@/apiService";
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const sort = (req.nextUrl.searchParams.get("sort") as string) || "release_date";

    const order = (req.nextUrl.searchParams.get("order") as "desc" | "asc") || "desc";
    const limit = parseInt(req.nextUrl.searchParams.get("limit") as string) || 10;

    const validSortFields = [
      "id",
      "name",
      "release_date",
      "reproductions",
      "duration",
      "created_at",
    ];

    const orderBy = () => {
      let orderBy: Record<string, ("asc" | "desc") | { _count: "asc" | "desc" }> = {
        release_date: "desc",
      };
      if (validSortFields.includes(sort)) orderBy = { [sort]: order };

      if (sort === "likes") {
        orderBy = { likes: { _count: order } };
      }
      return orderBy;
    };
    const response = await prisma.tracksOnArtists.findMany({
      orderBy: { track: { ...orderBy() } },
      take: limit,
      where: {
        artist_id: id,
      },
      select: {
        track: {
          select: {
            id: true,
            name: true,
            image: true,
            song: true,
            release_date: true,
            duration: true,
            reproductions: true,
            _count: {
              select: {
                likes: true,
              },
            },
            albums: {
              select: { album: { select: { id: true, name: true, image: true } } },
            },
          },
        },
      },
    });
    if (!response || response.length === 0) {
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
      httpStatusCode: 200,
      data: response,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
