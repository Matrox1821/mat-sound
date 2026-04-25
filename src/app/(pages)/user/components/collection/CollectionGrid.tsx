import { UserCollection } from "@/types/user.types";
import { CollectionCard } from "./CollectionCard";
import { use } from "react";

export function CollectionGrid({
  collectionPromise,
}: {
  collectionPromise: Promise<UserCollection[]>;
}) {
  const collection = use(collectionPromise);
  if (collection.length === 0)
    return (
      <div className="border border-amber-700 bg-amber-600/10 rounded-md p-4">
        En este momento no existen elementos.
      </div>
    );
  return (
    <ul className="w-full grid grid-cols-4 auto-cols-max gap-4 justify-items-start">
      {collection.map((element) => (
        <CollectionCard key={element.id} element={element} />
      ))}
    </ul>
  );
}
