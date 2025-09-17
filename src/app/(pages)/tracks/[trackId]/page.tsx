import Background from "@/components/Layout/Background";
import getTrack from "@/hooks/db/useTrack";
import { formatPlaylistDuration, formatTime, parseNumberListeners } from "@/shared/helpers";
import Image from "next/image";
import Link from "next/link";

export default async function TrackPage({ params }: { params: Promise<{ trackId: string }> }) {
  const { trackId } = await params;
  const { track } = await getTrack(trackId);
  if (!track) return null;
  return (
    <section className="w-full z-20 h-full flex flex-col md:relative md:bg-background md:transition-[heigth] md:duration-200 overflow-y-auto overflow-x-hidden focus-visible:outline-0">
      <article className="w-full h-full flex flex-col justify-center px-26">
        {track.image && (
          <figure className="w-full h-[calc(1/2*100vh)] absolute top-0 left-0 z-20 flex items-center justify-center after:content-[''] after:w-full after:h-[calc(1/2*100vh)] after:absolute after:left-0 after:top-0 after:bg-linear-to-t after:from-background after:to-background-950/50">
            <Image
              src={track.image}
              alt={track.name}
              width={2160}
              height={2160}
              className="object-cover w-full h-full"
            />
          </figure>
        )}
        <div className="flex items-center gap-4 z-30 h-full">
          {track.image && (
            <Image
              src={track.image}
              alt={track.name}
              width={1080}
              height={1080}
              className="object-cover w-60 h-60 rounded-lg"
            />
          )}
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold">{track.name}</h2>
            {track.artists &&
              track.artists.map(({ artist }) => (
                <span className="flex gap-2" key={artist.id}>
                  <Image
                    src={track.image}
                    alt={track.name}
                    width={40}
                    height={40}
                    className="object-cover w-6 h-6 rounded-full"
                  />
                  <Link className="hover:underline" href={`/artist/${artist.id}`}>
                    {artist.name}
                  </Link>
                </span>
              ))}
            <span className="flex flex-col">
              <span className="flex gap-1">
                <span>1 canción </span>
                <span>
                  {"("}
                  {formatTime(track.duration)}
                  {")"}
                </span>
              </span>
              <span className="flex gap-1">
                <span>{new Date(track.releaseDate).getFullYear()}</span>
              </span>
              <span className="flex gap-1">
                <span>{parseNumberListeners(track.reproductions)} reproducciones</span>
              </span>
            </span>
          </div>
        </div>
      </article>

      <div className="w-full h-full relative p-8 flex flex-col gap-8 px-26 bg-background">
        <table className="w-full">
          <thead>
            <tr className="uppercase h-16 w-full text-start text-sm text-background-400">
              <th className="h-full w-12 text-center font-light">#</th>
              <th className="h-full w-auto text-start font-light">Título</th>
              <th className="h-full w-auto text-start font-light">Artista</th>
              <th className="h-full w-20 text-start font-light">Dur.</th>
              <th className="h-full w-40 text-start font-light"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:[&>td]:bg-background-800/70 h-14">
              <td className="text-center text-sm text-background-400 font-extralight rounded-l-xl">
                1
              </td>
              <td className="">{track.name}</td>
              <td className="">
                {track.artists &&
                  track.artists.map(({ artist }) => (
                    <Link href={`/artists/${artist.id}`} key={artist.id}>
                      {artist.name}
                    </Link>
                  ))}
              </td>
              <td className="">{formatTime(track.duration)}</td>
              <td className="rounded-r-xl">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
