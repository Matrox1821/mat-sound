import { Suspense } from "react";
import { GridSkeleton } from "../../components/collection/GridSkeleton";
import { CollectionGrid } from "../../components/collection/CollectionGrid";
import { getUserPlaylistsCollection } from "@/actions/user/collection";

export default async function CollectionPlaylistsPage() {
  const userCollection = getUserPlaylistsCollection();
  return (
    <section className="pt-12">
      <Suspense fallback={<GridSkeleton />}>
        <CollectionGrid collectionPromise={userCollection} />
      </Suspense>
    </section>
  );
}
