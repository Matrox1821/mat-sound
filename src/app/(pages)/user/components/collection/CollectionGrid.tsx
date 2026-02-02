import { UserCollection } from "@/types/user.types";
import { CollectionCard } from "./CollectionCard";
import { use } from "react";

export function CollectionGrid({
  collectionPromise,
}: {
  collectionPromise: Promise<UserCollection[]>;
}) {
  const collection = use(collectionPromise);
  return (
    <ul className="w-full grid grid-cols-4 auto-cols-max gap-4 justify-items-start">
      {collection.map((element) => (
        <CollectionCard key={element.id} element={element} />
      ))}
    </ul>
  );
}
