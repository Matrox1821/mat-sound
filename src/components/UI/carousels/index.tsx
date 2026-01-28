import { CarouselProps } from "@shared-types/components";
import { CarouselSwiper } from "./CarouselSwiper";
import { Suspense } from "react";
import { CarouselSkeleton } from "@components/skeletons";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { contentApi } from "@/queryFn/client/contentApi";

export async function Carousel({ remove, options, filter, title }: CarouselProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const dataToRemove = remove?.artistId || remove?.albumId || remove?.trackId || "";

  const content = contentApi.getContent({
    type: options?.type || ["tracks"],
    limit: options?.limit || 8,
    remove: dataToRemove,
    filter,
    userId: session?.user.id,
  });
  return (
    <article className="relative w-full flex flex-col pl-4">
      <Suspense fallback={<CarouselSkeleton />}>
        <CarouselSwiper data={content} title={title} />
      </Suspense>
    </article>
  );
}
