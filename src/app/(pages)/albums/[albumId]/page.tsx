import Background from "@/components/Layout/Background";
import getAlbum from "@/hooks/db/useAlbum";
import { formatPlaylistDuration, formatTime, parseNumberListeners } from "@/shared/helpers";
import Image from "next/image";
import Link from "next/link";

export default async function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  const { album } = await getAlbum(albumId);
  if (!album) return null;

  return (
    <section className="w-full z-20 h-full flex md:relative md:bg-background-950 md:transition-[heigth] md:duration-200 overflow-y-auto focus-visible:outline-0">
      <Background image={album.image} className="px-40 pt-20 pb-30 gap-30">
        <article className="w-1/3 flex flex-col items-center">
          <div className="fixed flex flex-col items-center gap-4">
            {album.artist && (
              <span className="flex items-center gap-2">
                <Image
                  src={album.artist.image}
                  alt={album.artist.name}
                  width={40}
                  height={40}
                  className="object-cover w-6 h-6 rounded-full"
                />
                <Link className="hover:underline" href={`/artist/${album.artist.id}`}>
                  {album.artist.name}
                </Link>
              </span>
            )}
            {album.image && (
              <Image
                src={album.image}
                alt={album.name}
                width={1080}
                height={1080}
                className="object-cover w-72 h-72 rounded-md"
              />
            )}
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-2xl font-bold">{album.name}</h2>
              <span className="flex flex-col items-center">
                <span className="flex gap-1">
                  <span>Álbum • </span>
                  <span>{new Date(album.releaseDate).getFullYear()}</span>
                </span>
                <span className="flex gap-1">
                  <span>{album.tracksCount} canciones • </span>
                  <span>{formatPlaylistDuration(album.duration)}</span>
                </span>
              </span>
            </div>
          </div>
        </article>
        <article className="w-2/3">
          <ul className="z-30 top-0 left-0 w-full flex flex-col gap-3">
            {album.tracks &&
              album.tracks?.map(({ track, orderInAlbum }) => (
                <li key={track.id} className="flex gap-6 justify-between items-center">
                  <div className="flex gap-6 items-center">
                    <span className="text-background-200">{orderInAlbum}</span>
                    <div>
                      <h4 className="font-semibold">{track.name}</h4>
                      <span className="flex gap-1 text-sm text-background-200">
                        {track.artists &&
                          track.artists.map(({ artist }) => (
                            <span className="flex gap-1" key={artist.id}>
                              <Link className="hover:underline" href={`/artist/${artist.id}`}>
                                {artist.name}
                              </Link>
                              •
                            </span>
                          ))}
                        <span>{parseNumberListeners(track.reproductions)} reproducciones</span>
                      </span>
                    </div>
                  </div>
                  <time className="text-background-200">{formatTime(track.duration)}</time>
                </li>
              ))}
          </ul>
        </article>
      </Background>
    </section>
  );
}
