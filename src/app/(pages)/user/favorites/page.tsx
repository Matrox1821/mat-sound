import { auth } from "@/lib/auth";
import { userApi } from "@/queryFn/client/userApi";
import { headers } from "next/headers";
import FavoritesTable from "../components/FavoritesTable";
import { Suspense } from "react";

export default async function FavoritesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const favoritesPromise = userApi.getFavorites(session?.user.id);

  return (
    <section className="flex flex-col gap-12 w-full h-full overflow-y-auto overflow-x-hidden md:pt-8 md:bg-background md:transition-[heigth] md:duration-200 lg:pt-24 lg:pl-18">
      <Suspense fallback={"loading"}>
        <FavoritesTable tracksPromise={favoritesPromise} />
      </Suspense>
    </section>
  );
}
