import { fetchAlbumDataById } from "@/shared/client/adapters/fetchAlbumData";
import { Suspense } from "react";
import { CoverInfoSkeleton, MainCoverSkeleton, TableSkeleton } from "./components/Skeleton";
import MainCover from "./components/MainCover";
import Table from "./components/Table";
import CoverInfo from "./components/CoverInfo";

export default async function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
  const { albumId } = await params;
  const albumPromise = fetchAlbumDataById(albumId);
  if (!albumPromise) return null;

  return (
    <section className="w-full z-20 h-full md:relative md:bg-background-950 md:transition-[heigth] md:duration-200 overflow-y-auto focus-visible:outline-0">
      <article className="w-full h-[calc(1/2*100vh)] flex flex-col justify-center px-26 relative">
        <Suspense fallback={<MainCoverSkeleton />}>
          <MainCover albumPromise={albumPromise} />
        </Suspense>
        <Suspense fallback={<CoverInfoSkeleton />}>
          <CoverInfo albumPromise={albumPromise} />
        </Suspense>
      </article>
      <Suspense fallback={<TableSkeleton />}>
        <Table albumPromise={albumPromise} />
      </Suspense>
      {/*  <article className="sticky w-1/3 flex flex-col items-center left-0">
        <div className="fixed flex flex-col items-center gap-4">
          {album.artists &&
            album.artists.map((artist) => (
              <span className="flex items-center gap-2" key={artist.id}>
                <Image
                  src={artist.avatar.sm}
                  alt={artist.name}
                  width={40}
                  height={40}
                  className="object-cover w-6 h-6 rounded-full"
                />
                <Link className="hover:underline" href={`/artist/${artist.id}`}>
                  {artist.name}
                </Link>
              </span>
            ))}
          {album.cover && (
            <Image
              src={album.cover.sm}
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
      <article className="w-2/3 ">
        <ul className="z-30 top-0 left-0 w-full flex flex-col gap-4">
          {album.tracks &&
            album.tracks?.map((track) => (
              <li
                key={track.id}
                className="flex gap-6 justify-between items-center !hover:[&>button>.play]:flex !hover:[&>button>span]:hidden"
              >
                <div className="flex gap-6 items-center">
                  <button className="cursor-pointer">
                    <Play className="play hidden" />
                    <span className="text-background-200 flex">{track.order}</span>
                  </button>

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
      </article> */}
    </section>
  );
}
