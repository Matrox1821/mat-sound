import { Skeleton } from "primereact/skeleton";

export default function Loading() {
  return (
    <main className="w-full h-screen bg-background p-8 flex flex-col gap-8">
      <div className="flex gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-24! flex-1 rounded-lg!" key={index} />
        ))}
      </div>
      <div className="flex w-full gap-8 flex-1">
        <Skeleton className="w-3/5 h-full! rounded-lg!" />
        <Skeleton className="flex-1 h-full! rounded-lg!" />
      </div>
    </main>
  );
}
