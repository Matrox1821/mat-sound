import { FavoritesHeader } from "../components/favorites/FavoritesHeader";
import { FavoritesTable } from "../components/favorites/FavoritesTable";

export default async function FavoritesPage() {
  return (
    <section className="flex flex-col gap-12 w-full h-full overflow-y-auto overflow-x-hidden md:pt-8 md:bg-background md:transition-[heigth] md:duration-200 lg:pt-24 lg:pl-18">
      <FavoritesHeader />
      <FavoritesTable />
    </section>
  );
}
