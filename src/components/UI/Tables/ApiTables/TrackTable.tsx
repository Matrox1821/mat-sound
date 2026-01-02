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

export default function TracksTable({
  data,
  rows = "6",
}: {
  data: Promise<{ name: string; id: string; cover: JsonValue }[] | undefined>;
  rows?: string;
}) {
  const tracks = use(data);

  const toast = useRef<Toast>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fillEmptyRows = (
    arr: { name: string; id: string; cover: JsonValue }[] | undefined,
    minRows: number
  ) => {
    const filled = [...(arr || [])];
    const emptyCount = minRows - (arr?.length || 0);

    for (let i = 0; i < emptyCount; i++) {
      filled.push({ name: "", id: `empty-${i}`, cover: { sm: "", md: "", lg: "" } });
    }

    return filled;
  };
  const accept = async (id: string) => {
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

  const confirm = async (event: any, id: string) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Do you want to delete this record?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => accept(id),
      reject,
    });
  };

  const filledArtists = fillEmptyRows(tracks, Number(rows));

  const parsedArtists = filledArtists.map(
    ({ id, name, cover }: { id: string; name: string; cover: JsonValue }) => {
      return { id, name, cover: cover as { sm: string; md: string; lg: string } };
    }
  );

  /*   const editBodyTemplate = (artist: any) => {
    if (!artist.name) return null;
    return (
      <div>
        <Button type="button" className="!p-3" severity="warning">
          <i className="pi pi-pencil !text-xl !font-semibold leading-5" />
        </Button>
      </div>
    );
  }; */

  const imageBodyTemplate = (artist: any) => {
    if (artist.cover.sm === "") return <div className="h-[46px]" />;
    return (
      <Image
        src={artist.cover.sm}
        alt={artist.name}
        height={45}
        width={45}
        loading="lazy"
        className="rounded-sm"
      />
    );
  };

  const deleteBodyTemplate = (artist: any) => {
    if (!artist.name) return <div className="h-[46px]" />;
    return (
      <div>
        <Toast />
        <ConfirmPopup />
        <Button
          type="button"
          className="!p-3"
          severity="danger"
          onClick={(e: any) => confirm(e, artist.id)}
        >
          <i className="pi pi-trash !text-xl !font-semibold leading-5" />
        </Button>
      </div>
    );
  };

  return (
    <DataTable value={parsedArtists} scrollable scrollHeight="531px" className="bg-background-800">
      <Column
        field="image"
        header="Image"
        className="w-60 bg-background-800 !border-background"
        body={imageBodyTemplate}
      ></Column>
      <Column
        field="name"
        header="Nombre"
        className="w-60 bg-background-800 !border-background"
      ></Column>
      {/* <Column
        header="Editar"
        body={editBodyTemplate}
        className="w-20 bg-background-800 !border-background"
      ></Column> */}
      <Column
        header="Borrar"
        body={deleteBodyTemplate}
        className="w-20 bg-background-800 !border-background"
      ></Column>
    </DataTable>
  );
}
