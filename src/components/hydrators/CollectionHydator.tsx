"use client";

import { useCollectionStore } from "@/store/collectionStore";
import { CollectionService } from "@/types/user.types";
import { use, useEffect } from "react";

export function CollectionHydrator({
  collection: promiseCollection,
}: {
  collection: Promise<CollectionService | null>;
}) {
  const collection = use(promiseCollection);
  const hydrate = useCollectionStore((s) => s.hydrate);
  useEffect(() => {
    if (collection) hydrate(collection);
  }, [hydrate, collection]);

  return null;
}
