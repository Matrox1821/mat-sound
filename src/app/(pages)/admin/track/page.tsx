import { FormDialog } from "@/components/UI/Dialog/Form/FormDialog";
import Paginator from "@/components/UI/Paginator";
import TracksTable from "@/components/UI/Tables/ApiTables/TrackTable";
import { genreAdminApi } from "@/queryFn/admin/genreApi";
import { trackAdminApi } from "@/queryFn/admin/trackApi";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string; rows?: string }>;
}) {
  const params = await searchParams;
  const page = params?.page;
  const rows = params?.rows;

  const paginationInfo = trackAdminApi.getTracksPaginationInfo();

  const tracks = trackAdminApi.getTracksByPage({ page, rows });
  const genres = genreAdminApi.getGenres();

  return (
    <main className="w-full h-screen">
      <section className="w-full h-1/6 flex items-center justify-center">
        <FormDialog type="track" data={genres} />
      </section>
      <hr className="text-background-700 w-full" />
      <section className="flex justify-center items-center w-full py-20 flex-col">
        <div className="w-1/2 rounded-xl bg-background-800 p-2 flex flex-col gap-4">
          <Suspense fallback={<div className="w-full h-[480px]" />}>
            <TracksTable data={tracks} rows={rows} />
          </Suspense>
          <Suspense fallback={<span>loading</span>}>
            <Paginator paginationInfo={paginationInfo} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
