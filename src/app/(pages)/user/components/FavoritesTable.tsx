import TrackTable from "@/components/ui/tables/TrackTable";
import { parseTrackByPlayer } from "@/shared/client/parsers/trackParser";
import { playerTrackProps } from "@/types/trackProps";
import { use } from "react";

export default function FavoritesTable({
  tracksPromise,
}: {
  tracksPromise: Promise<playerTrackProps[] | null>;
}) {
  const tracksData = use(tracksPromise);
  if (!tracksData) return null;

  const tracks = tracksData.map((t) => parseTrackByPlayer(t));

  return (
    <article className="pr-14 py-8 bg-background">
      <TrackTable tracks={tracks} showCover playingFromLabel="Favoritos" />
    </article>
  );
}
