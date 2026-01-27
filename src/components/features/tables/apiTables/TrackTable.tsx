"use client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { use } from "react";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { TrackByPagination } from "@shared-types/track.types";
import { FormDialog } from "../../dialogs/FormDialog";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { EditTrackForm } from "../../forms/trackForm/editTrack";
import { SeeTrackBody } from "../../dialogs/SeeTrackBody";
import { deleteTrackServer } from "@/actions/track";
import { SafeImage } from "@components/ui/images/SafeImage";

export default function TracksTable({
  data,
  rows = "6",
  genres,
}: {
  data: Promise<TrackByPagination[] | null>;
  rows?: string;
  genres: Promise<{ name: string; id: string }[] | null>;
}) {
  const tracks = use(data);
  const { message, error } = useToast();

  const fillEmptyRows = (arr: TrackByPagination[] | null, minRows: number) => {
    const filled = [...(arr || [])];
    const emptyCount = minRows - (arr?.length || 0);

    for (let i = 0; i < emptyCount; i++) {
      filled.push({ name: "", id: `empty-${i}`, cover: { sm: "", md: "", lg: "" } });
    }

    return filled;
  };
  const filledTrack = fillEmptyRows(tracks, Number(rows));

  const handleDelete = async ({ id, name }: { id: string; name: string }) => {
    try {
      await deleteTrackServer(id);
      message(`Artista [ ${name} ] eliminado.`);
    } catch {
      error(`Error al eliminar [ ${name} ]`);
    }
  };

  const confirm = async ({ event, id, name }: { event: any; id: string; name: string }) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Quieres borrar este artista?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Si",
      rejectLabel: "No",
      accept: () => handleDelete({ id, name }),
    });
  };

  const deleteBodyTemplate = (track: any) => {
    if (!track.name) return <div className="h-[46px]" />;
    return (
      <div>
        <ConfirmPopup />
        <button
          type="button"
          className="h-11 w-11 bg-red-500/20 border border-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-500/10"
          onClick={(event: any) => confirm({ event, id: track.id, name: track.name })}
        >
          <i className="pi pi-trash !text-xl !text-white leading-5" />
        </button>
      </div>
    );
  };

  const editBodyTemplate = (track: any) => {
    if (!track.name) return null;
    return (
      <div>
        <FormDialog
          newButton={{
            buttonImage: <i className="pi pi-pencil !text-xl !text-white leading-5" />,
            buttonStyle:
              "h-11 w-11 bg-sky-500/20 border border-sky-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-sky-500/10",
          }}
        >
          <EditTrackForm track={track} genres={genres} />
        </FormDialog>
      </div>
    );
  };

  const seeBodyTemplate = (track: any) => {
    if (!track.name) return null;
    return (
      <div>
        <FormDialog
          newButton={{
            buttonImage: <i className="pi pi-eye !text-xl !text-white leading-5" />,
            buttonStyle: "h-11 w-11  rounded-lg flex items-center justify-center cursor-pointer ",
          }}
        >
          <SeeTrackBody track={track} />
        </FormDialog>
      </div>
    );
  };

  const imageBodyTemplate = (track: any) => {
    if (track.name !== "")
      return (
        <SafeImage
          src={track.cover && track.cover.sm}
          alt={track.name}
          height={45}
          width={45}
          loading="lazy"
          className="!rounded-sm !w-[45px] !h-[45px]"
        />
      );

    return null;
  };

  return (
    <DataTable value={filledTrack} scrollable scrollHeight="531px" className="bg-background-900">
      <Column
        field="image"
        header="Image"
        className="w-60 bg-background-900 !border-background"
        body={imageBodyTemplate}
      ></Column>
      <Column
        field="name"
        header="Nombre"
        headerClassName="!w-full"
        className="w-60 bg-background-900 !border-background"
      ></Column>
      <Column
        header=""
        body={seeBodyTemplate}
        headerClassName="!w-9 !text-center"
        className="!aspect-square !h-11 !w-11 bg-background-900 !border-background !text-center"
      ></Column>
      <Column
        header="Editar"
        body={editBodyTemplate}
        headerClassName="!w-9 !text-center"
        className="!aspect-square !h-11 !w-11 bg-background-900 !border-background !text-center"
      ></Column>
      <Column
        header="Borrar"
        body={deleteBodyTemplate}
        headerClassName="!w-9 !text-center"
        className="!aspect-square !h-11 !w-11 bg-background-900 !border-background !text-center"
      ></Column>
    </DataTable>
  );
}
