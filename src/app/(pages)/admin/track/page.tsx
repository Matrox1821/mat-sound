import { FormDialog } from "@components/features/dialogs/FormDialog";
import Paginator from "@components/features/paginator";
import TracksTable from "@components/features/tables/apiTables/TrackTable";
import { genreAdminApi } from "@/queryFn/admin/genreApi";
import { trackAdminApi } from "@/queryFn/admin/trackApi";
import { ProgressSpinner } from "primereact/progressspinner";
import { Suspense } from "react";
import BulkTrackUpload from "../components/BulkTrackUpload";
import { BulkDialog } from "@components/features/dialogs/BulkDialog";
import { SearchFilter } from "../components/SearchFilter";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    artistNameFilter?: string;
    albumNameFilter?: string;
    trackNameFilter?: string;
    page?: string;
    rows?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params?.page;
  const rows = params?.rows;
  const artistName = params?.artistNameFilter;
  const albumName = params?.albumNameFilter;
  const trackName = params?.trackNameFilter;

  const paginationInfo = trackAdminApi.getTracksPaginationInfo({
    artistName,
    albumName,
    trackName,
  });

  const tracks = trackAdminApi.getTracksByPage({
    page,
    rows,
    artistName,
    albumName,
    trackName,
  });
  const genres = genreAdminApi.getGenres();

  return (
    <main className="w-full h-screen bg-background">
      <section className="w-full h-1/8 flex items-center justify-evenly">
        <FormDialog type="track" data={genres} />
        <BulkDialog>
          <BulkTrackUpload />
        </BulkDialog>
      </section>
      <hr className="text-background-700 w-full" />
      <section className="w-full flex  items-center justify-center pt-8 gap-6">
        <SearchFilter queryName="artistNameFilter" placeholder="Buscar por nombre de artista" />
        <SearchFilter queryName="albumNameFilter" placeholder="Buscar por nombre de album" />
        <SearchFilter queryName="trackNameFilter" placeholder="Buscar por nombre de cancion" />
      </section>
      <section className="flex justify-center items-center w-full pt-10 flex-col">
        <div className="w-1/2 rounded-xl bg-background-900 p-2 flex flex-col gap-4">
          <Suspense fallback={<ProgressSpinner className="w-full h-[480px]" />}>
            <TracksTable data={tracks} rows={rows} genres={genres} />
          </Suspense>
          <Suspense fallback={<span></span>}>
            <Paginator paginationInfo={paginationInfo} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
