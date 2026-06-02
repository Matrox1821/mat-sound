import { FormDialog } from "@components/features/dialogs/FormDialog";
import { Paginator } from "@components/features/paginator";
import { ProgressSpinner } from "primereact/progressspinner";
import { Suspense } from "react";
import { BulkDialog } from "@components/features/dialogs/BulkDialog";
import { AlbumsTable } from "@components/features/tables/apiTables/AlbumsTable";
import { SearchFilter } from "../components/SearchFilter";
import { BulkAlbumUpload } from "../components/BulkAlbumUpload";
import { getAlbumsPaginationInfo } from "@/shared/server/album/album.service";
import { getAlbumsByPagination } from "@/shared/server/album/album.repository";
import { Filter } from "../components/Filter";
import { AlbumSearchParams } from "@/types/album.types";
import { parseAlbumSearchParams } from "@/shared/client/parsers/adminSearchParams";

const FILTERS = [
  { id: "no-cover", label: "Sin portada" },
  { id: "no-artists", label: "Sin álbumes" },
  { id: "no-tracks", label: "Sin canciones" },
];

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<AlbumSearchParams>;
}) {
  const params = await parseAlbumSearchParams(searchParams);

  const paginationInfo = getAlbumsPaginationInfo(params);

  const data = getAlbumsByPagination({ params });
  return (
    <main className="w-full h-screen bg-background">
      <Filter filters={FILTERS} />
      <div className="h-1/5 flex flex-col justify-evenly">
        <section className="w-full flex items-center justify-center gap-6">
          <SearchFilter queryName="artistNameFilter" placeholder="Buscar por nombre de artista" />
          <SearchFilter queryName="albumNameFilter" placeholder="Buscar por nombre de album" />
        </section>

        <section className="w-full h-1/6 flex items-center justify-evenly">
          <FormDialog type="album" />
          <BulkDialog>
            <BulkAlbumUpload />
          </BulkDialog>
        </section>
      </div>
      <section className="flex justify-center items-center w-full flex-col">
        <div className="w-1/2 rounded-xl bg-background-900 p-2 flex flex-col gap-4">
          <Suspense fallback={<ProgressSpinner className="w-full h-[480px]" />}>
            <AlbumsTable data={data} rows={params.rows} />
          </Suspense>
          <Suspense fallback={<span></span>}>
            <Paginator paginationInfo={paginationInfo} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
