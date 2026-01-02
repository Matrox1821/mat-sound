import { onSuccessRequest, onThrowError } from "@/apiService";
import { createGenre, genreIsExist, getGenres } from "@/shared/server/genre/genreRepository";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const genres = [formData.getAll("genre") as string[]].flat();
  const parsedGenres = [...new Set(genres)];
  try {
    const request = parsedGenres.map(async (genre) => {
      const genreLowerCase = genre.toLocaleLowerCase();
      const isExist = await genreIsExist(genreLowerCase);

      if (!isExist && genreLowerCase !== "") return await createGenre(genreLowerCase);
    });

    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.CREATED,
      data: { request },
    });
  } catch (error) {
    return onThrowError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const genres = await getGenres();
    return onSuccessRequest({
      httpStatusCode: HttpStatusCode.OK,
      data: genres,
    });
  } catch (error) {
    return onThrowError(error);
  }
}
