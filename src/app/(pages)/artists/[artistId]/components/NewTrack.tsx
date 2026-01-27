import { SafeImage } from "@components/ui/images/SafeImage";
import { ArtistTracks } from "@shared-types/artist.types";
import Link from "next/link";

export function NewArtistTrack({
  newTrack,
  artistImage,
  artistName,
}: {
  newTrack: ArtistTracks[] | null;
  artistImage?: string;
  artistName?: string;
}) {
  if (!newTrack || !newTrack[0]) return null;
  const track = newTrack[0];
  return (
    <Link href={`/tracks/${track.id}`} className="relative flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Selección del artista</h2>
      <div className="flex-none w-[350px] h-[250px] relative rounded-xl after:content-[''] after:w-full after:h-[101%] after:bg-linear-to-t after:from-background after:to-60% after:to-background-950/10 after:absolute after:top-0 after:rounded-xl after:z-10">
        <SafeImage
          src={track.cover && track.cover.md}
          alt={track.name}
          width={350}
          height={250}
          className="!object-cover !rounded-xl !w-full !h-full"
        />
        <div className="absolute w-full h-full top-0 z-20 p-4">
          <span className="flex items-center p-1 bg-content-950 text-background gap-2 rounded-full justify-start absolute">
            {artistImage && artistName && (
              <SafeImage
                src={artistImage}
                alt={artistName}
                width={24}
                height={24}
                className="!h-6 !w-6 !rounded-full"
              />
            )}
            <span className="pr-1 max-w-[19ch] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[15px]">
              New Release
            </span>
          </span>
          <span className="absolute flex gap-6 bottom-4 items-center">
            <SafeImage
              src={track.cover && track.cover.sm}
              alt={track.name}
              width={60}
              height={60}
              className="!relative !w-18 !h-18 !object-cover !rounded-md"
            />
            <span className="flex flex-col">
              <span className="text-content-950 font-semibold max-w-[19ch] overflow-hidden text-ellipsis whitespace-nowrap">
                {track.name}
              </span>
              <span className="text-background-300 font-normal max-w-[19ch] overflow-hidden text-ellipsis whitespace-nowrap">
                Sencillo
              </span>
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
