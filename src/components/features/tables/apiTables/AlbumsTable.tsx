"use client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { use } from "react";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { AlbumByPagination } from "@/types/album.types";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { FormDialog } from "../../dialogs/FormDialog";
import { deleteAlbumServer } from "@/actions/album";
import { EditAlbumForm } from "../../forms/albumForm/editAlbum";
import { SeeAlbumBody } from "../../dialogs/SeeAlbumBody";
import { SafeImage } from "@/components/ui/images/SafeImage";

export default function AlbumsTable({
  data,
  rows = "6",
}: {
  data: Promise<AlbumByPagination[] | undefined>;
  rows?: string;
}) {
  const albums = use(data);
  const { message, error } = useToast();
  if (!albums) return;

  const fillEmptyRows = (arr: AlbumByPagination[], minRows: number) => {
    const filled = [...arr];
    const emptyCount = minRows - arr.length;

    for (let i = 0; i < emptyCount; i++) {
      filled.push({ name: "", id: `empty-${i}`, cover: { sm: "", md: "", lg: "" } });
    }

    return filled;
  };
  const filledAlbums = fillEmptyRows(albums, Number(rows));

  const handleDelete = async ({ id, name }: { id: string; name: string }) => {
    try {
      await deleteAlbumServer(id);
      message(`Album ${name} eliminado.`);
    } catch {
      error(`Error al eliminar el album ${name}`);
    }
  };

  const confirm = async ({ event, id, name }: { event: any; id: string; name: string }) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Quieres eliminar este album?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete({ id, name }),
    });
  };

  const deleteBodyTemplate = (album: any) => {
    if (!album.name) return <div className="h-[44px] w-[44px]" />;
    return (
      <div className="h-11 w-11">
        <ConfirmPopup />
        <button
          type="button"
          className="h-11 w-11 bg-red-500/20 border border-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-500/10"
          onClick={(event: any) => confirm({ event, id: album.id, name: album.name })}
        >
          <i className="pi pi-trash !text-xl !text-white leading-5" />
        </button>
      </div>
    );
  };

  const editBodyTemplate = (album: any) => {
    if (!album.name) return null;
    return (
      <div className="h-11 w-11">
        <FormDialog
          newButton={{
            buttonImage: <i className="pi pi-pencil !text-xl !text-white leading-5" />,
            buttonStyle:
              "h-11 w-11 bg-sky-500/20 border border-sky-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-sky-500/10",
          }}
        >
          <EditAlbumForm album={album} />
        </FormDialog>
      </div>
    );
  };

  const seeBodyTemplate = (album: any) => {
    if (!album.name) return null;
    return (
      <div>
        <FormDialog
          newButton={{
            buttonImage: <i className="pi pi-eye !text-xl !text-white leading-5" />,
            buttonStyle: "h-11 w-11  rounded-lg flex items-center justify-center cursor-pointer ",
          }}
        >
          <SeeAlbumBody album={album} />
        </FormDialog>
      </div>
    );
  };

  const imageBodyTemplate = (album: any) => {
    if (album.name !== "")
      return (
        <SafeImage
          src={album.cover && album.cover.sm}
          alt={album.name}
          height={45}
          width={45}
          loading="lazy"
          className="!rounded-sm !w-[45px] !h-[45px]"
        />
      );

    return null;
  };
  return (
    <DataTable value={filledAlbums} scrollable scrollHeight="531px" className="bg-background-900 ">
      <Column
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
        className="w-20 bg-background-900 !border-background"
      ></Column>
      <Column
        header="Editar"
        headerClassName="!w-9 !text-center"
        body={editBodyTemplate}
        className="!aspect-square !h-11 !w-11 bg-background-900 !border-background !text-center"
      ></Column>
      <Column
        header="Borrar"
        headerClassName="!w-9 !text-center"
        className="!aspect-square !h-11 !w-11 bg-background-900 !border-background !text-center"
        body={deleteBodyTemplate}
      ></Column>
    </DataTable>
  );
}
