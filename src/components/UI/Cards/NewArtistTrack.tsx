import getArtistTracks from "@/hooks/db/useArtistTracks";
import Image from "next/image";

export default async function NewArtistTrack({
  artistId,
  artistImage,
  artistName,
}: {
  artistId: string;
  artistImage: string;
  artistName: string;
}) {
  const { tracks } = await getArtistTracks({
    id: artistId,
    query: { order: "desc", sortBy: "release_date", limit: 1 },
  });

  if (!tracks || !tracks[0]) return null;

  const track = tracks[0];
  return (
    <div className="relative flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Selección del artista</h2>
      <div className="w-[350px] h-[250px] relative rounded-xl after:content-[''] after:w-full after:h-full after:bg-linear-to-t after:from-background-950 after:to-60% after:to-background-950/10 after:absolute after:top-0 after:rounded-xl after:z-10">
        <Image
          src={track.image}
          alt={track.name}
          width={500}
          height={300}
          className="absolute w-full h-full object-cover rounded-xl "
        />
        <div className="relative w-full h-full top-0 z-20 p-4">
          <span className="flex items-center p-1 bg-content-950 text-background gap-2 rounded-full justify-start absolute">
            <Image
              src={artistImage}
              alt={artistName}
              width={24}
              height={24}
              className="h-6 w-6 rounded-full"
            />
            <span className="pr-1 max-w-[19ch] overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[15px]">
              {track.name}
            </span>
          </span>
          <span className="absolute flex gap-6 bottom-4 items-center">
            <Image
              src={track.image}
              alt={track.name}
              width={60}
              height={60}
              className="relative w-18 h-18 object-cover rounded-md"
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
    </div>
  );
}
