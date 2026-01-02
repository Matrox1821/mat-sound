import { artistPageProps } from "@/types";
import Image from "next/image";
import { Skeleton } from "primereact/skeleton";
import { use } from "react";

export default function MainCover({
  artistPromise,
}: {
  artistPromise: Promise<artistPageProps | null>;
}) {
  const artist = use(artistPromise);
  return (
    <figure className="w-full h-[calc(5/12*100vh)] absolute top-0 left-0 z-20 flex items-center justify-center object-cover">
      {artist?.mainCover ? (
        <Image
          src={artist?.mainCover}
          alt={artist?.name}
          width={2160}
          height={1080}
          className="opacity-80 object-cover w-full h-full"
        />
      ) : (
        <Skeleton width="100%" height="100%" borderRadius="0" />
      )}
    </figure>
  );
}
