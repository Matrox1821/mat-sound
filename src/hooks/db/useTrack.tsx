import { getTrackById } from "@/queryFn/client";
import { parseTrack } from "@/shared/parsers";
import { trackPageProps } from "@/types";

export default async function getTrack(id: string) {
  const track = await getTrackById(id).then((data) => data.data || null);
  const parsedTrack = parseTrack(track);

  return { track: parsedTrack as trackPageProps | null };
}
