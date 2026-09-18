import { Skeleton } from "primereact/skeleton";

export default function Loading() {
  return (
    <main className="w-full h-full flex justify-center items-center bg-background">
      <div className="w-full max-w-md flex flex-col gap-6 p-8">
        <Skeleton className="h-10! w-48! self-center" />
        <Skeleton className="h-12! w-full!" />
        <Skeleton className="h-12! w-full!" />
        <Skeleton className="h-12! w-full!" />
      </div>
    </main>
  );
}
