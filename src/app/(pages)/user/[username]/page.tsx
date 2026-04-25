import { userApi } from "@/queryFn/client/userApi";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserCarousel } from "@components/ui/carousels/UserCarousel";
import { Cover } from "../components/Cover";
import { CoverInfo } from "../components/CoverInfo";
import {
  getFavoritesToUserContent,
  getPlaylistsToUserContent,
} from "@/shared/server/user/user.service";
export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { username } = await params;
  if (!session || !username) return;
  const userPromise = userApi.getUser(username);

  const playlistsPromise = getPlaylistsToUserContent(username);
  const favoritesPromise = getFavoritesToUserContent({ username });
  return (
    <section className="w-full z-20 h-full flex flex-col relative md:bg-background md:transition-[heigth] md:duration-200 focus-visible:outline-0">
      <article className="w-full h-[calc(5/12*100vh)] flex flex-col justify-center pl-26 relative">
        <Cover userPromise={userPromise} currentUser={session.user.username} />
        <CoverInfo userPromise={userPromise} />
      </article>
      <article className="pl-18 pt-12 h-full pb-40 flex flex-col gap-12">
        <UserCarousel dataPromise={playlistsPromise} userPromise={userPromise} title="Playlists" />
        <UserCarousel
          dataPromise={favoritesPromise}
          userPromise={userPromise}
          currentUser={session.user.username}
          title="Favoritos"
        />
      </article>
    </section>
  );
}
