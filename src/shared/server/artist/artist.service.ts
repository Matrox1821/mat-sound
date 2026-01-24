"use server";
import {
  countArtists,
  deleteArtistById as deleteArtist,
  artistIsExists,
  updateArtistImages,
  getArtistsByPagination,
  getArtistTracks,
} from "./artist.repository";
import { CustomError } from "@/types/error.type";
import { HttpStatusCode } from "@/types/httpStatusCode";
import { GET_BUCKET_URL } from "@/shared/utils/constants";
import { ImageSizes } from "@/types/common.types";
import { ArtistByPagination } from "@/types/artist.types";
import { mapArtistTracks } from "./artist.mapper";
import { getRandomTracksIdsByGenre, getTracksByIds } from "../track/track.repository";

const ARTISTS_PER_PAGES = 6;

export const validateArtistUniqueness = async ({
  name,
  id,
}: {
  name?: string;
  id?: string;
}): Promise<boolean> => {
  const existingArtist = await artistIsExists({ name, id });
  if (existingArtist) {
    throw new CustomError({
      errors: [
        {
          message: name
            ? `An artist with the name "${name}" already exists.`
            : `An artist with ID ${id} is already registered.`,
        },
      ],
      msg: "Conflict: Duplicate entry",
      httpStatusCode: HttpStatusCode.CONFLICT,
    });
  }
  return existingArtist;
};

export const getArtistsPaginationInfo = async ({
  query = "",
}: {
  query: string;
}): Promise<{
  amount: number;
  pages: number;
}> => {
  const amount = await countArtists({ query });
  const pages = Math.ceil(amount / ARTISTS_PER_PAGES);
  return { amount, pages };
};

export const deleteArtistById = async ({ id }: { id: string }) => {
  const artistDeleted = await deleteArtist(id);
  if (!artistDeleted) {
    throw new CustomError({
      errors: [{ message: `Could not delete album. No album found with ID: ${id}` }],
      msg: "Deletion failed: Album not found.",
      httpStatusCode: HttpStatusCode.NOT_FOUND,
    });
  }
};

export const getArtistsByPage = async ({
  page,
  rows,
  query = "",
}: {
  page: number;
  rows: number;
  query: string;
}): Promise<ArtistByPagination[]> => {
  return await getArtistsByPagination({ page, rows, query });
};

export const addImagePathsToArtist = async ({
  artistId,
  paths,
}: {
  artistId: string;
  paths: { avatar: ImageSizes | null; mainCover: string | null; covers: string[] | null };
}): Promise<{
  name: string;
  id: string;
  avatar: ImageSizes | null;
  mainCover: string | null;
  covers: string[] | null;
}> => {
  const { avatar, mainCover, covers } = paths;
  const parsedCovers =
    covers && covers.map((coverPath) => (coverPath ? GET_BUCKET_URL + coverPath : ""));

  const updatedArtist = await updateArtistImages({
    id: artistId,
    paths: {
      avatar: avatar || { sm: "", md: "", lg: "" },
      covers: parsedCovers || [""],
      mainCover: mainCover ? GET_BUCKET_URL + mainCover : "",
    },
  });
  if (!updatedArtist)
    throw new CustomError({
      errors: [{ message: "The artist has not been updated" }],
      msg: "The artist has not been updated",
      httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  return updatedArtist;
};

export const addAvatarToArtist = async ({
  artistId,
  paths,
}: {
  artistId: string;
  paths: { avatar: ImageSizes; mainCover: string | null; covers: string[] | null };
}): Promise<{
  name: string;
  id: string;
  avatar: ImageSizes | null;
  mainCover: string | null;
  covers: string[] | null;
}> => {
  const { avatar, mainCover, covers } = paths;
  const parsedCovers =
    covers && covers.map((coverPath) => (coverPath ? GET_BUCKET_URL + coverPath : ""));

  const updatedArtist = await updateArtistImages({
    id: artistId,
    paths: {
      avatar,
      covers: parsedCovers || [""],
      mainCover: mainCover ? GET_BUCKET_URL + mainCover : "",
    },
  });
  if (!updatedArtist)
    throw new CustomError({
      errors: [{ message: "The artist has not been updated" }],
      msg: "The artist has not been updated",
      httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  return updatedArtist;
};

export const getSortedArtistTracks = async ({
  id,
  sort,
  limit,
  order,
  userId,
  tracksRecommended,
}: {
  id?: string;
  sort: string;
  order: "asc" | "desc";
  limit: number;
  userId: string | null;
  tracksRecommended?: boolean;
}) => {
  const validSortFields = ["id", "name", "releaseDate", "reproductions", "duration", "createdAt"];

  const setOrderBy = ({
    fields,
    sort,
    order,
  }: {
    fields: string[];
    sort: string;
    order: "asc" | "desc";
  }) => {
    let orderBy: Record<string, ("asc" | "desc") | { _count: "asc" | "desc" }> = {
      release_date: "desc",
    };
    if (fields.includes(sort)) orderBy = { [sort]: order };

    if (sort === "likes") {
      orderBy = { likes: { _count: order } };
    }
    return orderBy;
  };
  const filter = setOrderBy({ sort, order, fields: validSortFields });
  const tracks = await getArtistTracks({ id, limit, orderBy: filter, userId });

  if (!tracks || tracks.length === 0) {
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
  if (!tracksRecommended) {
    return {
      tracks: mapArtistTracks(tracks),
    };
  }
  const genres = tracks.map((track) => track.genres.map((genre) => genre.id));
  const uniqueGenres = [...new Set(genres?.flat())].filter(Boolean);
  const trackIds = tracks.map((track) => track.id);
  const recommendedIds = await getRandomTracksIdsByGenre(20, trackIds, uniqueGenres);
  const idsList = recommendedIds.map((item) => item.id);
  const recommendedTracks = await getTracksByIds({ trackIds: idsList });
  const mappedTracks = {
    tracks: mapArtistTracks(tracks),
    ...(recommendedTracks !== null && { recommended: mapArtistTracks(recommendedTracks) }),
  };
  return mappedTracks;
};
