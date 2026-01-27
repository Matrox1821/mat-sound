import { FormDialog } from "@components/features/dialogs/FormDialog";
import Paginator from "@components/features/paginator";
import { albumAdminApi } from "@/queryFn/admin/albumApi";
import { ProgressSpinner } from "primereact/progressspinner";
import { Suspense } from "react";
import { BulkDialog } from "@components/features/dialogs/BulkDialog";
import AlbumsTable from "@components/features/tables/apiTables/AlbumsTable";
import { SearchFilter } from "../components/SearchFilter";
import BulkAlbumUpload from "../components/BulkAlbumUpload";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    artistNameFilter?: string;
    albumNameFilter?: string;
    page?: string;
    rows?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params?.page;
  const rows = params?.rows;
  const artistName = params?.artistNameFilter;
  const albumName = params?.albumNameFilter;

  const paginationInfo = albumAdminApi.getAlbumsPaginationInfo({ artistName, albumName });

  const data = albumAdminApi.getAlbumsByPage({ page, rows, artistName, albumName });
  return (
    <main className="w-full h-screen bg-background">
      <section className="w-full h-1/6 flex items-center justify-evenly">
        <FormDialog type="album" />
        <BulkDialog>
          <BulkAlbumUpload />
        </BulkDialog>
      </section>
      <hr className="text-background-700 w-full" />
      <section className="w-full flex items-center justify-center pt-8 gap-6">
        <SearchFilter queryName="artistNameFilter" placeholder="Buscar por nombre de artista" />
        <SearchFilter queryName="albumNameFilter" placeholder="Buscar por nombre de album" />
      </section>
      <section className="flex justify-center items-center w-full pt-8 flex-col">
        <div className="w-1/2 rounded-xl bg-background-900 p-2 flex flex-col gap-4">
          <Suspense fallback={<ProgressSpinner className="w-full h-[480px]" />}>
            <AlbumsTable data={data} rows={rows} />
          </Suspense>
          <Suspense fallback={<span></span>}>
            <Paginator paginationInfo={paginationInfo} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
