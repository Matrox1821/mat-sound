import { MediaCard } from "@/types/content.types";
import { searchRepository } from "./search.repository";
import { SearchEntity } from "./search.select";

type RankedResult = MediaCard & {
  rank: number;
  priority: number;
};

export async function searchService(
  q: string,
  entity: SearchEntity = "all",
): Promise<MediaCard[] | null> {
  if (!q.trim()) return null;

  const results = (await searchRepository(q.trim(), entity)) as RankedResult[];
  return results
    .sort((a, b) => {
      if (a.type === "artists" && b.type !== "artists") return -1;
      if (b.type === "artists" && a.type !== "artists") return 1;
      if (a.priority !== b.priority) return b.priority - a.priority;
      return b.rank - a.rank;
    })
    .slice(0, 15)
    .map(({ rank, priority, ...item }) => item as MediaCard);
}
