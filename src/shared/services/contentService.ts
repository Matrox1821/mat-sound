import {
  fetchTracks,
  fetchAlbums,
  fetchArtists,
  fetchPlaylists,
} from "../repositories/contentRepository";
import { CustomError } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { NextRequest } from "next/server";

export const getContent = async (req: NextRequest) => {
  const type = (req.nextUrl.searchParams.getAll("type") as string[]) || ["tracks"];
  const limit = parseInt(req.nextUrl.searchParams.get("limit") as string) || 10;
  const idToRemove = req.nextUrl.searchParams.get("remove") as string;
  const filter =
    (req.nextUrl.searchParams.get("filter") as
      | "artists"
      | "tracks"
      | "albums"
      | "playlists"
      | null) || "none";
  const filterId = req.nextUrl.searchParams.get("filterId") as string;

  let elements: any[] = [];

  if (type.includes("tracks"))
    elements = elements.concat(await fetchTracks(limit, { by: filter, id: filterId }));
  if (type.includes("albums"))
    elements = elements.concat(await fetchAlbums(limit, { by: filter, id: filterId }));
  if (type.includes("artists")) elements = elements.concat(await fetchArtists(limit));
  if (type.includes("playlists")) elements = elements.concat(await fetchPlaylists(limit));

  if (!elements.length) {
    throw new CustomError({
      errors: [{ message: "The search returned no results. No elements were found." }],
      msg: "The search returned no results. No elements were found.",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }

  if (idToRemove) {
    elements = elements.filter((e: any) => e.id !== idToRemove);
  }

  return elements.sort(() => Math.random() - 0.5).slice(0, limit);
};
