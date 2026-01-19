"use client";
import Image from "next/image";
import { use } from "react";

export default function Cover({ userPromise }: { userPromise: Promise<any | null> }) {
  const user = use(userPromise);
  return (
    <figure className="w-full h-[calc(5/12*100vh)] absolute top-0 left-0 z-20 flex items-center justify-center after:content-[''] after:w-full after:h-[calc(5/12*100vh)] after:absolute after:left-0 after:top-0 after:bg-linear-to-t after:from-background/90 after:to-background-950/30 bg-black">
      {user.image && (
        <>
          <span className="h-full w-full overflow-hidden">
            <Image
              src={user.image.lg}
              alt={user.name}
              width={1200}
              height={1200}
              className="object-cover w-full h-full blur-2xl"
            />
          </span>
          <span className="h-full w-full">
            <Image
              src={user.image.lg}
              alt={user.name}
              width={1200}
              height={1200}
              className="object-cover w-full h-full"
            />
          </span>
          <span className="h-full w-full overflow-hidden">
            <Image
              src={user.image.lg}
              alt={user.name}
              width={1200}
              height={1200}
              className="object-cover w-full h-full blur-2xl"
            />
          </span>
        </>
      )}
    </figure>
  );
}
