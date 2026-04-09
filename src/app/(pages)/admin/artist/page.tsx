import { FormDialog } from "@components/features/dialogs/FormDialog";
import { Paginator } from "@components/features/paginator";
import { ProgressSpinner } from "primereact/progressspinner";
import { Suspense } from "react";
import { BulkDialog } from "@components/features/dialogs/BulkDialog";
import { ArtistsTable } from "@components/features/tables/apiTables/ArtistsTable";
import { BulkArtistUpload } from "../components/BulkArtistUpload";
import { SearchFilter } from "../components/SearchFilter";
import { getArtistsByPage, getArtistsPaginationInfo } from "@/shared/server/artist/artist.service";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ artistNameFilter?: string; page?: string; rows?: string }>;
}) {
  const params = await searchParams;
  const page = params?.page ? +params.page : 1;
  const rows = params?.rows ? +params.rows : 6;
  const query = params?.artistNameFilter;

  const paginationInfo = getArtistsPaginationInfo({ query });

  const data = getArtistsByPage({ page, rows, query });
  return (
    <main className="w-full h-screen bg-background">
      <section className="w-full h-1/6 flex items-center justify-evenly">
        <FormDialog type="artist" />
        <BulkDialog>
          <BulkArtistUpload />
        </BulkDialog>
      </section>
      <hr className="text-background-700 w-full" />
      <section className="w-full flex items-center justify-center pt-8">
        <SearchFilter queryName="artistNameFilter" placeholder="Buscar por nombre de artista" />
      </section>
      <section className="flex justify-center items-center w-full py-8 flex-col">
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
