import { FormDialog } from "@components/features/dialogs/FormDialog";
import { Paginator } from "@components/features/paginator";
import { ProgressSpinner } from "primereact/progressspinner";
import { Suspense } from "react";
import { BulkDialog } from "@components/features/dialogs/BulkDialog";
import { ArtistsTable } from "@components/features/tables/apiTables/ArtistsTable";
import { BulkArtistUpload } from "../components/BulkArtistUpload";
import { SearchFilter } from "../components/SearchFilter";
import { getArtistsByPage, getArtistsPaginationInfo } from "@/shared/server/artist/artist.service";
import { parseArtistSearchParams } from "@/shared/client/parsers/adminSearchParams";
import { ArtistSearchParams } from "@/types/artist.types";
import { Filter } from "../components/Filter";

const FILTERS = [
  { id: "no-avatar", label: "Sin avatar" },
  { id: "no-main-cover", label: "Sin portada principal" },
  { id: "no-description", label: "Sin descripción" },
  { id: "no-is-verified", label: "Sin verificación" },
  { id: "no-regional-listeners", label: "Sin oyentes regionales" },
  { id: "no-socials", label: "Sin redes sociales" },
  { id: "no-covers", label: "Sin portadas" },
  { id: "no-albums", label: "Sin álbumes" },
  { id: "no-tracks", label: "Sin canciones" },
];

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<ArtistSearchParams>;
}) {
  const params = await parseArtistSearchParams(searchParams);

  const paginationInfo = getArtistsPaginationInfo(params);

  const data = getArtistsByPage({ params });
  return (
    <main className="w-full h-screen bg-background">
      <Filter filters={FILTERS} />
      <div className="h-1/5 flex flex-col justify-evenly">
        <section className="w-full flex items-center justify-center">
          <SearchFilter queryName="artistNameFilter" placeholder="Buscar por nombre de artista" />
        </section>
        <section className="w-full h-1/8 flex items-center justify-evenly">
          <FormDialog type="artist" />
          <BulkDialog>
            <BulkArtistUpload />
          </BulkDialog>
        </section>
      </div>
      <section className="flex justify-center items-center w-full flex-col">
        <div className="w-1/2 rounded-xl bg-background-900 p-2 flex flex-col gap-4">
          <Suspense fallback={<ProgressSpinner className="w-full h-[480px]" />}>
            <ArtistsTable data={data} rows={params.rows} />
          </Suspense>
          <Suspense fallback={<span></span>}>
            <Paginator paginationInfo={paginationInfo} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
