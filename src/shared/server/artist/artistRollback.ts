import { deleteFileToBucket } from "../files";
import { deleteArtistById } from "./artistRepository";

interface RollbackOptions {
  artistId: string;
  r2Path: Record<string, string>;
  buffer: Record<"sm" | "md" | "lg", Buffer | null>;
  mainCoverPath: string;
  mainCoverFile: File | null;
  covers: File[] | null;
  coversPath: string[];
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
    ...Object.entries(r2Path).map(async ([key, path]) => {
      const currentBuffer = buffer[key as "sm" | "md" | "lg"];
      if (currentBuffer) await deleteFileToBucket(currentBuffer, path);
    }),

    // eliminar portada
    deleteFileToBucket(mainCoverFile, mainCoverPath),

    // eliminar covers
    ...covers.map(async (cover, i) => deleteFileToBucket(cover, coversPath[i])),
  ]);
};
