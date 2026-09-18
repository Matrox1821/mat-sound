import { ProfileContentSkeleton, ProfileHeroSkeleton } from "../components/Skeleton";

export default function Loading() {
  return (
    <section className="w-full z-20 h-full flex flex-col relative md:bg-background md:transition-[heigth] md:duration-200 focus-visible:outline-0">
      <article className="w-full h-[calc(5/12*100vh)] flex flex-col justify-center pl-26 relative">
        <ProfileHeroSkeleton />
      </article>
      <article className="pl-18 pt-12 h-full pb-40 flex flex-col gap-12">
        <ProfileContentSkeleton />
      </article>
    </section>
  );
}
