"use client";
import Image from "next/image";
import { use } from "react";

export default function CoverInfo({ userPromise }: { userPromise: Promise<any | null> }) {
  const user = use(userPromise);
  if (!user) return;
  return (
    <article className="flex items-center gap-4 z-30 relative h-[calc(5/12*100vh)]">
      {user.cover && (
        <Image
          src={user.cover.md}
          alt={user.name}
          width={1080}
          height={1080}
          className="object-cover w-60 h-60 rounded-lg"
        />
      )}
      <span className="flex flex-col">
        <h2 className="text-3xl font-bold">{user.displayUsername}</h2>
        <span className="text-xl">Editar</span>
      </span>
    </article>
  );
}
