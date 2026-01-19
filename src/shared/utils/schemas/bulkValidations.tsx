import { z } from "zod";

export const artistBulkSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(10, "La descripción es muy corta"),
  isVerified: z.boolean().default(false),
  listeners: z.number().int().nonnegative("Los oyentes no pueden ser negativos"),
  followers: z.number().int().nonnegative("Los seguidores no pueden ser negativos"),
  genres: z.array(z.string()).optional().default([]),
});

export const albumBulkSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  releaseDate: z.iso.datetime(),
});

export const trackBulkSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  releaseDate: z.iso.datetime("Formato de fecha ISO inválido"),
  duration: z.number().int().positive("La duración debe ser en segundos"),
  reproductions: z.number().int().nonnegative(),
  genres: z.array(z.string()).min(1, "Incluye al menos un género"),
  order: z.number().int().positive(),
  disk: z.number().int().positive().default(1),
});

export type ArtistBulkInput = z.infer<typeof artistBulkSchema>;
export type AlbumBulkInput = z.infer<typeof albumBulkSchema>;
export type TrackBulkInput = z.infer<typeof trackBulkSchema>;
