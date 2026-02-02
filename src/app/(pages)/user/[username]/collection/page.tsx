import { getUserCollection } from "@/actions/user";
import { CollectionGrid } from "../../components/collection/CollectionGrid";
import { GridSkeleton } from "../../components/collection/GridSkeleton";
import { Suspense } from "react";

export default async function CollectionPage() {
  const userCollection = getUserCollection();
  return (
    <section className="pt-12">
      <Suspense fallback={<GridSkeleton />}>
        <CollectionGrid collectionPromise={userCollection} />
      </Suspense>
    </section>
  );
}
