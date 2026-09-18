import { Skeleton } from "primereact/skeleton";

export function AdminTablePageSkeleton({ filterCount = 1 }: { filterCount?: number }) {
  return (
    <main className="w-full h-screen bg-background p-8 flex flex-col gap-8">
      <Skeleton className="h-10! w-40!" />
      <div className="flex flex-col gap-6 items-center">
        <div className="w-full flex items-center justify-center gap-6">
          {Array.from({ length: filterCount }).map((_, index) => (
            <Skeleton className="h-10! w-64!" key={index} />
          ))}
        </div>
        <div className="flex gap-6">
          <Skeleton className="h-10! w-36!" />
          <Skeleton className="h-10! w-36!" />
        </div>
      </div>
      <section className="flex justify-center items-center w-full flex-col">
        <div className="w-1/2 rounded-xl bg-background-900 p-2 flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton className="h-12! w-full!" key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
