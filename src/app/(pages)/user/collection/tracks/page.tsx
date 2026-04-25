import { Suspense } from "react";
import { GridSkeleton } from "../../components/collection/GridSkeleton";
import { CollectionGrid } from "../../components/collection/CollectionGrid";
import { getUserTracksCollection } from "@/actions/user/collection";

export default async function CollectionFavoritesPage() {
  const userCollection = getUserTracksCollection();
  return (
    <section className="pt-12">
      <Suspense fallback={<GridSkeleton />}>
        <CollectionGrid collectionPromise={userCollection} />
      </Suspense>
    </section>
  );
}
