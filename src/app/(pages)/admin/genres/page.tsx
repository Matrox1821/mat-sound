import { FormDialog } from "@/components/UI/Dialog/Form/FormDialog";
import GenresPaginator from "@/components/UI/Paginator";
import GenresTable from "@/components/UI/Tables/ApiTables/GenresTable";
import { genreAdminApi } from "@/queryFn/admin/genreApi";
import { ProgressSpinner } from "primereact/progressspinner";

import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string; rows?: string }>;
}) {
  const params = await searchParams;
  const page = params?.page;
  const rows = params?.rows;

  const paginationInfo = genreAdminApi.getGenresPaginationInfo();

  const data = genreAdminApi.getGenresByPagination({ page, rows });

  return (
    <main className="w-full h-screen bg-background">
      <section className="w-full h-1/6 flex items-center justify-center">
        <FormDialog type="genre" />
      </section>
      <hr className="text-background-700" />
      <section className="flex justify-center items-center w-full py-20 flex-col">
        <div className="w-1/2 rounded-xl bg-background-900 p-2 flex flex-col gap-4">
          <Suspense fallback={<ProgressSpinner className="w-full h-[480px]" />}>
            <GenresTable data={data} rows={rows} />
          </Suspense>
          <Suspense fallback={<span></span>}>
            <GenresPaginator paginationInfo={paginationInfo} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
