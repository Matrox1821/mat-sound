import { CarouselClient } from "@/components/ui/carousels/CarouselClient";
import { Cover } from "../components/Cover";
import { CoverInfo } from "../components/CoverInfo";
import {
  getFavoritesToUserContent,
  getPlaylistsToUserContent,
} from "@/shared/server/user/user.service";
import { Carousel } from "@/components/ui/carousels";
import { getUser } from "@/actions/user";
import { Suspense } from "react";
import { CarouselSkeleton, ProfileHeroSkeleton } from "../components/Skeleton";
export default async function UserPage() {
  const username = getUser()?.then((user) => user?.username);
  const userPromise = getUser();

  const playlistsPromise = getPlaylistsToUserContent();
  const favoritesPromise = getFavoritesToUserContent();
  return (
    <section className="w-full z-20 h-full flex flex-col relative md:bg-background md:transition-[heigth] md:duration-200 focus-visible:outline-0">
      <article className="w-full h-[calc(5/12*100vh)] flex flex-col justify-center pl-26 relative">
        <Suspense fallback={<ProfileHeroSkeleton />}>
          <Cover userPromise={userPromise} currentUserPromise={username} />
          <CoverInfo userPromise={userPromise} />
        </Suspense>
      </article>
      <article className="pl-18 pt-12 h-full pb-40 flex flex-col gap-12">
        <Suspense fallback={<CarouselSkeleton numVisible={8} />}>
          <CarouselClient dataPromise={playlistsPromise} title="Playlists" />
        </Suspense>
        <Suspense fallback={<CarouselSkeleton numVisible={8} />}>
          <CarouselClient dataPromise={favoritesPromise} title="Favoritos" />
        </Suspense>
        <Carousel
          options={{ isRecomendation: true, limit: 12, type: ["all"] }}
          forCurrentUser
          title="Recomendaciones"
        />
      </article>
    </section>
  );
}
