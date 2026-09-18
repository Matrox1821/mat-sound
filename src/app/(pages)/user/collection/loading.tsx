import { GridSkeleton } from "../components/collection/GridSkeleton";

export default function Loading() {
  return (
    <section className="w-full pt-12 flex justify-center">
      <GridSkeleton />
    </section>
  );
}
