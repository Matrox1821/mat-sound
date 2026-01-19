"use server";
import { ImageSizes } from "@/types/common.types";
import { deleteFileToBucket } from "../files";
import { deleteArtistById } from "./artist.repository";

interface RollbackOptions {
  artistId: string;
  r2Path: ImageSizes | null;
  buffer: Record<keyof ImageSizes, Buffer | null> | null;
  mainCoverPath: string | null;
  mainCoverFile: File | null;
  covers: File[] | null;
  coversPath: string[] | null;
}

export const rollbackArtistCreation = async ({
  artistId,
  r2Path,
  buffer,
  mainCoverPath,
  mainCoverFile,
  covers,
  coversPath,
}: RollbackOptions) => {
  if (!buffer || !mainCoverFile || !covers) return;
  await Promise.all([
    deleteArtistById(artistId),

    // eliminar avatares
    ...(r2Path
      ? Object.entries(r2Path).map(async ([key, path]) => {
          const currentBuffer = buffer[key as "sm" | "md" | "lg"];
          if (currentBuffer && path) {
            await deleteFileToBucket(currentBuffer, path);
          }
        })
      : []),

    // eliminar portada
    deleteFileToBucket(mainCoverFile, mainCoverPath),

    // eliminar covers
    ...covers.map(async (cover, i) => {
      if (coversPath && coversPath.length > 0) deleteFileToBucket(cover, coversPath[i]);
    }),
  ]);
};
