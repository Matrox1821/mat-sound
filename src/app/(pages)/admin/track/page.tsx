import { FormDialog } from "@components/features/dialogs/FormDialog";
import { Paginator } from "@components/features/paginator";
import { TracksTable } from "@components/features/tables/apiTables/TrackTable";
import { ProgressSpinner } from "primereact/progressspinner";
import { Suspense } from "react";
import { BulkDialog } from "@components/features/dialogs/BulkDialog";
import { BulkTrackUpload } from "../components/BulkTrackUpload";
import { SearchFilter } from "../components/SearchFilter";
import { getGenres } from "@/shared/server/genre/genre.repository";
import { getTracksPaginationInfo } from "@/shared/server/track/track.service";
import { getTracksByPagination } from "@/shared/server/track/track.repository";
import { Filter } from "../components/Filter";
import { TrackSearchParams } from "@/types/track.types";
import { parseTrackSearchParams } from "@/shared/client/parsers/adminSearchParams";

const FILTERS = [
  { id: "no-song", label: "Sin audio" },
  { id: "no-image", label: "Sin portada" },
  { id: "no-genres", label: "Sin géneros" },
  { id: "no-reproductions", label: "Sin reproducciones" },
  { id: "no-lyrics", label: "Sin letra" },
  { id: "no-artist", label: "Sin artista" },
  { id: "no-album", label: "Sin álbum" },
];

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<TrackSearchParams>;
}) {
  const params = await parseTrackSearchParams(searchParams);

  const paginationInfo = getTracksPaginationInfo(params);

  const tracks = getTracksByPagination({ params });
  const genres = getGenres();

  return (
    <main className="w-full h-screen bg-background">
      <Filter filters={FILTERS} />
      <div className="h-1/5 flex flex-col justify-evenly">
        <section className="w-full flex items-center justify-center gap-6">
          <SearchFilter queryName="artistName" placeholder="Buscar por nombre de artista" />
          <SearchFilter queryName="albumName" placeholder="Buscar por nombre de album" />
          <SearchFilter queryName="trackName" placeholder="Buscar por nombre de cancion" />
        </section>
        <section className="w-full h-1/8 flex items-center justify-evenly">
          <FormDialog type="track" data={genres} />
          <BulkDialog>
            <BulkTrackUpload />
          </BulkDialog>
        </section>
      </div>

      <section className="flex justify-center items-center w-full flex-col">
        <div className="w-1/2 rounded-xl bg-background-900 p-2 flex flex-col gap-4">
          <Suspense fallback={<ProgressSpinner className="w-full h-[480px]" />}>
            <TracksTable data={tracks} rows={params.rows} genres={genres} />
          </Suspense>
          <Suspense fallback={<span></span>}>
            <Paginator paginationInfo={paginationInfo} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
