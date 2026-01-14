"use client";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { use, useRef } from "react";

import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { JsonValue } from "@prisma/client/runtime/client";

export default function AlbumsTable({
  data,
  rows = "6",
}: {
  data: Promise<{ name: string; id: string; cover: JsonValue }[] | undefined>;
  rows?: string;
}) {
  const albums = use(data);
  const toast = useRef<Toast>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  if (!albums) return;

  const fillEmptyRows = (
    arr: { name: string; id: string; cover: JsonValue }[],
    minRows: number
  ) => {
    const filled = [...arr];
    const emptyCount = minRows - arr.length;

    for (let i = 0; i < emptyCount; i++) {
      filled.push({ name: "", id: `empty-${i}`, cover: { sm: "", md: "", lg: "" } });
    }

    return filled;
  };
  const accept = async () => {
    const params = new URLSearchParams(searchParams);
    toast.current?.show({
      severity: "info",
      summary: "Confirmed",
      detail: "You have accepted",
      life: 3000,
    });
    const pathToRedirect = `${pathname}?${params.toString()}`;
    /* await deleteGenreById({ id, pathToRedirect }); */
  };

  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };

  const confirm = async (event: any) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Do you want to delete this record?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => accept(),
      reject,
    });
  };

  const filledAlbums = fillEmptyRows(albums, Number(rows));

  const parsedAlbums = filledAlbums.map(
    ({ id, name, cover }: { id: string; name: string; cover: JsonValue }) => {
      return { id, name, cover: cover as { sm: string; md: string; lg: string } };
    }
  );

  /*   const editBodyTemplate = (album: any) => {
    if (!album.name) return null;
    return (
      <div>
        <Button type="button" className="!p-3" severity="warning">
          <i className="pi pi-pencil !text-xl !font-semibold leading-5" />
        </Button>
      </div>
    );
  }; */

  const imageBodyTemplate = (album: any) => {
    if (album.cover.sm === "") return <div className="h-[46px]" />;
    return (
      <Image
        src={album.cover.sm}
        alt={album.name}
        height={45}
        width={45}
        loading="lazy"
        className="rounded-sm"
      />
    );
  };

  const deleteBodyTemplate = (album: any) => {
    if (!album.name) return <div className="h-[46px]" />;
    return (
      <div>
        <Toast />
        <ConfirmPopup />
        <Button type="button" className="!p-3" severity="danger" onClick={(e: any) => confirm(e)}>
          <i className="pi pi-trash !text-xl !font-semibold leading-5" />
        </Button>
      </div>
    );
  };

  return (
    <DataTable value={parsedAlbums} scrollable scrollHeight="531px" className="bg-background-900">
      <Column
        header="Image"
        className="w-60 bg-background-900 !border-background"
        body={imageBodyTemplate}
      ></Column>
      <Column
        field="name"
        header="Nombre"
        className="w-60 bg-background-900 !border-background"
      ></Column>
      {/* <Column
        header="Editar"
        body={editBodyTemplate}
        className="w-20 bg-background-800 !border-background"
      ></Column> */}
      <Column
        header="Borrar"
        body={deleteBodyTemplate}
        className="w-20 bg-background-900 !border-background"
      ></Column>
    </DataTable>
  );
}
