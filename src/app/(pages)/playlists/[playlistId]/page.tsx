import { Aside } from "../components/Aside";
import { Suspense } from "react";
import { AsideSkeleton } from "../components/Skeleton";
import { Playlist } from "../components/Playlist";
import { Background } from "../components/Background";
import { getPlaylist } from "@/shared/server/playlist/playlist.service";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;
  const getPlaylistData = async () => {
    return getPlaylist({
      id: playlistId,
    });
  };

  const playlistPromise = getPlaylistData();

  return (
    <section className="w-full z-20 h-full flex relative md:bg-background md:transition-[heigth] md:duration-200 focus-visible:outline-0">
      <Suspense fallback={<div className="hidden" />}>
        <Background playlistPromise={playlistPromise} />
      </Suspense>
      <Suspense fallback={<AsideSkeleton />}>
        <Aside playlistPromise={playlistPromise} />
      </Suspense>
      <article className="w-full h-full bg-background">
        <Suspense fallback={<div className="hidden" />}>
          <Playlist playlistPromise={playlistPromise} />
        </Suspense>
      </article>
    </section>
  );
}
