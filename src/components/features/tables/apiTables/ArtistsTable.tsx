"use client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { use } from "react";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { deleteArtistServer } from "@/actions/artist";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { ArtistByPagination } from "@/types/artist.types";
import { EditArtistForm } from "../../forms/artistForm/editArtist";
import { FormDialog } from "../../dialogs/FormDialog";
import { SeeArtistBody } from "../../dialogs/SeeArtistBody";
import { SafeImage } from "@/components/ui/images/SafeImage";

export default function ArtistsTable({
  data,
  rows = "6",
}: {
  data: Promise<ArtistByPagination[] | null>;
  rows?: string;
}) {
  const artists = use(data);
  const { message, error } = useToast();
  if (!artists) return;
  const fillEmptyRows = (arr: ArtistByPagination[], minRows: number) => {
    const filled = [...arr];
    const emptyCount = minRows - arr.length;
    for (let i = 0; i < emptyCount; i++) {
      filled.push({ name: "", id: `empty-${i}`, avatar: { sm: "", md: "", lg: "" } });
    }
    return filled;
  };
  const filledArtists = fillEmptyRows(artists, Number(rows));

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteArtistServer(id);
      message(`Artista ${name} eliminado.`);
    } catch {
      error(`Error al eliminar al artista ${name}.`);
    }
  };

  const confirm = async (event: any, id: string, name: string) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Quieres borrar este artista?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Si",
      rejectLabel: "No",
      accept: () => handleDelete(id, name),
    });
  };

  const deleteBodyTemplate = (artist: any) => {
    if (!artist.name) return <div className="h-[46px]" />;
    return (
      <div>
        <ConfirmPopup />
        <button
          type="button"
          className="h-11 w-11 bg-red-500/20 border border-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-500/10"
          onClick={(e: any) => confirm(e, artist.id, artist.name)}
        >
          <i className="pi pi-trash !text-xl !text-white leading-5" />
        </button>
      </div>
    );
  };

  const editBodyTemplate = (artist: any) => {
    if (!artist.name) return null;
    return (
      <div>
        <FormDialog
          newButton={{
            buttonImage: <i className="pi pi-pencil !text-xl !text-white leading-5" />,
            buttonStyle:
              "h-11 w-11 bg-sky-500/20 border border-sky-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-sky-500/10",
          }}
        >
          <EditArtistForm artist={artist} />
        </FormDialog>
      </div>
    );
  };

  const seeBodyTemplate = (artist: any) => {
    if (!artist.name) return null;
    return (
      <div>
        <FormDialog
          newButton={{
            buttonImage: <i className="pi pi-eye !text-xl !text-white leading-5" />,
            buttonStyle: "h-11 w-11  rounded-lg flex items-center justify-center cursor-pointer ",
          }}
        >
          <SeeArtistBody artist={artist} />
        </FormDialog>
      </div>
    );
  };

  const imageBodyTemplate = (artist: any) => {
    if (artist.name !== "")
      return (
        <div className="w-[45px] h-[45px] flex items-center justify-center">
          <SafeImage
            src={artist.avatar && artist.avatar.sm}
            alt={artist.name}
            height={45}
            width={45}
            loading="lazy"
            className="!rounded-sm !w-[45px] !h-[45px]"
          />
        </div>
      );

    return null;
  };

  return (
    <DataTable value={filledArtists} scrollable scrollHeight="531px" className="bg-background-900">
      <Column
        header="Image"
        className="w-auto bg-background-900 !border-background"
        body={imageBodyTemplate}
      ></Column>
      <Column
        field="name"
        header="Nombre"
        className="w-full bg-background-900 !border-background"
      ></Column>
      <Column
        header=""
        body={seeBodyTemplate}
        className="w-20 bg-background-900 !border-background"
      ></Column>
      <Column
        header="Editar"
        body={editBodyTemplate}
        className="w-20 bg-background-900 !border-background"
      ></Column>
      <Column
        header="Borrar"
        body={deleteBodyTemplate}
        className="w-20 bg-background-900 !border-background"
      ></Column>
    </DataTable>
  );
}
