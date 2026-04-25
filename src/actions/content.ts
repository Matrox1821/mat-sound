"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CustomError } from "@shared-types/error.type";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { CarouselContentProps, MediaCard } from "@shared-types/content.types";
import { getContent } from "@/shared/server/content/content.service";
import {
  getFavoritesToUserContent,
  getPlaylistsToUserContent,
} from "@/shared/server/user/user.service";

const filterMap = {
  artist: "artists",
  track: "tracks",
  album: "albums",
  playlist: "playlists",
} as const satisfies Record<string, "artists" | "tracks" | "albums" | "playlists">;

const resolveUsername = async (
  forCurrentUser: boolean,
  searchByUsername?: string,
): Promise<string> => {
  if (searchByUsername) return searchByUsername;

  if (forCurrentUser) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.username) {
      throw new CustomError({
        msg: "Unauthorized",
        httpStatusCode: HttpStatusCode.UNAUTHORIZED,
      });
    }
    return session.user.username;
  }

  throw new CustomError({
    msg: "Could not resolve username",
    httpStatusCode: HttpStatusCode.BAD_REQUEST,
  });
};

export const getCarouselContent = async (props: CarouselContentProps): Promise<MediaCard[]> => {
  const { remove, options, searchBy, forCurrentUser = false } = props;

  const isUserContent = forCurrentUser || searchBy?.type === "username";

  if (isUserContent) {
    const username = await resolveUsername(
      forCurrentUser,
      searchBy?.type === "username" ? searchBy.id : undefined,
    );

    const type = options?.type?.[0];

    if (type === "playlists") return getPlaylistsToUserContent({ username });
    if (type === "tracks") return getFavoritesToUserContent({ username });

    throw new CustomError({
      msg: `Unsupported user content type: "${type}"`,
      httpStatusCode: HttpStatusCode.BAD_REQUEST,
    });
  }

  return getContent({
    type: options?.type?.includes("all")
      ? ["tracks", "albums", "artists", "playlists"]
      : ((options?.type as string[] | undefined) ?? ["tracks"]),
    limit: options?.limit ?? 10,
    filter: searchBy?.type && searchBy.type !== "username" ? filterMap[searchBy.type] : "none",
    filterId: searchBy?.id,
    idToRemove: remove?.trackId ?? remove?.albumId ?? remove?.artistId ?? remove?.playlistId,
  });
};
