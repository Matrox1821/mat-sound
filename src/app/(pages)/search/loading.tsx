import { Skeleton } from "primereact/skeleton";

export default function Loading() {
  return (
    <section className="w-full overflow-y-auto mb-6 pr-2 p-8 flex flex-col gap-8">
      <Skeleton className="h-8! w-48!" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="flex items-center gap-4" key={index}>
            <Skeleton className="h-20! w-20! rounded-lg!" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-5! w-10/12!" />
              <Skeleton className="h-4! w-7/12!" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
