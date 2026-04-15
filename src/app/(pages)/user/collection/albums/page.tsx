import { Suspense } from "react";
import { GridSkeleton } from "../../components/collection/GridSkeleton";
import { CollectionGrid } from "../../components/collection/CollectionGrid";
import { getUserAlbumsCollection } from "@/actions/user/collection";

export default async function CollectionAlbumPage() {
  const userCollection = getUserAlbumsCollection();
  return (
    <section className="w-full pt-12 flex justify-center">
      <Suspense fallback={<GridSkeleton />}>
        <CollectionGrid collectionPromise={userCollection} />
      </Suspense>
    </section>
  );
}
