import { Skeleton } from "primereact/skeleton";

export default function Loading() {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center gap-8 md:bg-background">
      <div className="w-full max-w-md flex flex-col gap-6 p-8">
        <Skeleton className="h-10! w-48! self-center" />
        <Skeleton className="h-12! w-full!" />
        <Skeleton className="h-12! w-full!" />
        <Skeleton className="h-12! w-full!" />
        <Skeleton className="h-12! w-full!" />
      </div>
    </section>
  );
}
