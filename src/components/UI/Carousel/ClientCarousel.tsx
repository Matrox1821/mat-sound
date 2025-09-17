"use client";
import dynamic from "next/dynamic";
import { CarouselSkeleton } from "@/components/Skeletons";
import { CarousellContentProps } from "@/types/components";

const CarouselSwiper = dynamic(() => import("./CarouselSwiper"), {
  loading: () => <CarouselSkeleton />,
  ssr: false,
});

export default function ClientCarousel({ content }: { content: CarousellContentProps[] }) {
  return <CarouselSwiper content={content} />;
}
