import { CustomError, ImageSizes } from "@/types/apiTypes";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { getTracks } from "../track/trackRepository";
import { getAlbums } from "../album/albumRepository";
import { getPlaylists } from "../playlist/playlistRepository";
import { getArtistForContent } from "../artist/artistService";
import { getUserPlaylists } from "../user/userRepository";

interface userPlaylistsProps {
  playlists: {
    id: string;
    cover?: ImageSizes;
    images?: string[];
    name: string;
    isInPlaylist: boolean;
    tracks: {
      track: {
        id: string;
        cover: any;
      };
    }[];
  }[];
}

export const getContent = async ({
  type = ["tracks"],
  limit = 10,
  filter = "none",
  filterId = "",
  idToRemove,
  userId = "",
}: {
  type?: string[];
  limit?: number;
  filter?: "artists" | "tracks" | "albums" | "playlists" | "none";
  filterId?: string;
  idToRemove?: string;
  userId?: string;
}) => {
  let elements: any[] = [];
  if (type.includes("tracks")) {
    const userPlaylists = (await getUserPlaylists({ userId })) as userPlaylistsProps;
    const tracksData = await getTracks(limit, userId, { by: filter, id: filterId }, userPlaylists);

    const newTracks = await Promise.all(
      tracksData.map(async (track: any) => ({
        tracks: await getTracks(5, userId, { by: "tracks", id: track.id }, userPlaylists),
        ...track,
      }))
    );
    elements = elements.concat(newTracks);
    console.log(elements);
  }
  if (type.includes("albums"))
    elements = elements.concat(await getAlbums(limit, { by: filter, id: filterId }));
  if (type.includes("artists")) elements = elements.concat(await getArtistForContent(limit));
  if (type.includes("playlists")) elements = elements.concat(await getPlaylists(limit));

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
