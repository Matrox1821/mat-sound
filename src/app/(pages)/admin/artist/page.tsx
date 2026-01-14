import { FormDialog } from "@/components/ui/dialogs/form/FormDialog";
import Paginator from "@/components/ui/paginator";
import ArtistsTable from "@/components/ui/tables/apiTables/ArtistsTable";
import { artistAdminApi } from "@/queryFn/admin/artistApi";
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

  const paginationInfo = artistAdminApi.getArtistsPaginationInfo();

  const data = artistAdminApi.getArtistsByPage({ page, rows });

  return (
    <main className="w-full h-screen bg-background">
      <section className="w-full h-1/6 flex items-center justify-center">
        <FormDialog type="artist" />
      </section>
      <hr className="text-background-700 w-full" />
      <section className="flex justify-center items-center w-full py-20 flex-col">
        <div className="w-1/2 rounded-xl bg-background-900 p-2 flex flex-col gap-4">
          <Suspense fallback={<ProgressSpinner className="w-full h-[480px]" />}>
            <ArtistsTable data={data} rows={rows} />
          </Suspense>
          <Suspense fallback={<span></span>}>
            <Paginator paginationInfo={paginationInfo} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
