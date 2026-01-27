import { userApi } from "@/queryFn/client/userApi";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import UserCarousel from "@components/ui/carousels/UserCarousel";
import Cover from "../components/Cover";
import CoverInfo from "../components/CoverInfo";
export default async function UserPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;
  const userPromise = userApi.getUser(session?.user.username);
  const playlistsPromise = userApi.getPlaylists(session?.user.username);
  const favoritesPromise = userApi.getFavorites(session?.user.username);
  return (
    <section className="w-full z-20 h-full flex flex-col relative md:bg-background md:transition-[heigth] md:duration-200 focus-visible:outline-0">
      <article className="w-full h-[calc(5/12*100vh)] flex flex-col justify-center px-26 relative">
        <Cover userPromise={userPromise} />
        <CoverInfo userPromise={userPromise} />
      </article>
      <article className="pl-18 pt-12 h-full pb-40 flex flex-col gap-12">
        <UserCarousel dataPromise={favoritesPromise} title="Favoritos" />
        <UserCarousel dataPromise={playlistsPromise} title="Playlists" />
      </article>
    </section>
  );
}
