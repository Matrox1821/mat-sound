import { CarouselSkeleton } from "@/components/ui/carousels/CarouselSkeleton";

export default function Loading() {
  return (
    <section className="flex flex-col gap-8 w-full h-full overflow-y-auto overflow-x-hidden md:pt-8 md:bg-background md:transition-[heigth] md:duration-200 lg:pt-24 lg:pl-18">
      <CarouselSkeleton numVisible={8} hasTitle={true} />
      <CarouselSkeleton numVisible={8} hasTitle={true} />
      <CarouselSkeleton numVisible={8} hasTitle={true} />
    </section>
  );
}
