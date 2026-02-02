import { getUserAlbumsCollection } from "@/actions/user";
import { CollectionGrid } from "../../../components/collection/CollectionGrid";
import { Suspense } from "react";
import { GridSkeleton } from "../../../components/collection/GridSkeleton";

export default async function CollectionAlbumPage() {
  const userCollection = getUserAlbumsCollection();
  return (
    <section className="pt-12">
      <Suspense fallback={<GridSkeleton />}>
        <CollectionGrid collectionPromise={userCollection} />
      </Suspense>
    </section>
  );
}
