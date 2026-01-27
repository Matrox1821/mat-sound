import { CustomError } from "@shared-types/error.type";
import { getUserFavorites, getUserPlaylists } from "./user.repository";
import { HttpStatusCode } from "@shared-types/httpStatusCode";
import { mapFavoritesToMediaCard, mapPlaylistsToMediaCard } from "./user.mapper";
import { PlaylistCard } from "@shared-types/user.types";

export const getPlaylistsToUserContent = async (username: string): Promise<PlaylistCard[]> => {
  const playlists = await getUserPlaylists({ username });
  if (!playlists) {
    throw new CustomError({
      errors: [
        {
          message: "No artists were found to display in the content section.",
        },
      ],
      msg: "Empty artist list",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }
  return mapPlaylistsToMediaCard({ username, userPlaylists: playlists });
};

export const getFavoritesToUserContent = async ({ username }: { username: string }) => {
  const favorites = await getUserFavorites({ username });
  if (!favorites) {
    throw new CustomError({
      errors: [
        {
          message: "No artists were found to display in the content section.",
        },
      ],
      msg: "Empty artist list",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }
  return mapFavoritesToMediaCard({ username, userFavorites: favorites });
};
