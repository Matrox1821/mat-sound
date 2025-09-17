import getArtistTracks from "@/hooks/db/useArtistTracks";
import { formatTime } from "@/shared/helpers";
import Image from "next/image";
import Link from "next/link";

export default async function PopularTracks({ artistId }: { artistId: string }) {
  const { tracks } = await getArtistTracks({
    id: artistId,
    query: { sortBy: "reproductions", order: "desc", limit: 10 },
  });

  if (!tracks) return <div>s</div>;

  return (
    <div className="w-1/2 flex flex-col gap-8">
      <h2 className="text-2xl font-bold">Popular</h2>
      <div className="flex flex-col gap-6 pl-6">
        {tracks.map((track, i) => (
          <div
            key={track.id}
            className="flex items-center w-full justify-between text-background-300"
          >
            <span className="flex items-center gap-4">
              <span className="font-bold text-base">{i + 1}</span>
              <Image
                src={track.image}
                alt={track.name}
                width={100}
                height={100}
                className="w-12 h-12 rounded-md"
              />
              <Link href={`/tracks/${track.id}`} className="font-bold text-base text-content-950">
                {track.name}
              </Link>
            </span>
            <span className="flex gap-60">
              <span className="font-semibold text-base text-background-300">
                {track.reproductions.toLocaleString("En-US")}
              </span>
              <span className="font-semibold text-sm text-background-300">
                {formatTime(track.duration)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
