import { CarouselProps } from "@/types/components";
import useContent from "@/hooks/db/useContent";
import ClientCarousel from "./ClientCarousel";

export default async function Carousel({ remove, options, filter, title }: CarouselProps) {
  const rawContent = await useContent({ remove, options, filter });
  const content = rawContent.data ?? [];

  return (
    <article className="relative w-full h-80 flex flex-col pl-4">
      <h2 className="h-12 font-semibold text-xl ">{title}</h2>
      <ClientCarousel content={content} />
    </article>
  );
}
