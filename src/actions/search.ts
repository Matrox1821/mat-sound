"use server";

import { SearchEntity } from "@/shared/server/search/search.select";
import { searchService } from "@/shared/server/search/search.service";
import { MediaCard } from "@/types/content.types";

export async function searchAction(
  q: string,
  entity: SearchEntity = "all",
): Promise<MediaCard[] | null> {
  try {
    return await searchService(q, entity);
  } catch {
    return null;
  }
}
