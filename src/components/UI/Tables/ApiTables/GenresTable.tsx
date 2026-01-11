"use client";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { use, useRef } from "react";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { usePathname, useSearchParams } from "next/navigation";
import { genreCapitalize } from "@/shared/utils/helpers";

export default function GenresTable({
  data,
  rows = "6",
}: {
  data: Promise<{ name: string; id: string }[] | undefined>;
  rows?: string;
}) {
  const genres = use(data);
  if (!genres) return;
  const toast = useRef<Toast>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const capitalizeWords = (arr: { name: string; id: string }[]) => {
    return arr.map(({ name, id }) => ({
      name: genreCapitalize(name),
      id,
    }));
  };

  const fillEmptyRows = (arr: { name: string; id: string }[], minRows: number) => {
    const filled = [...arr];
    const emptyCount = minRows - arr.length;

    for (let i = 0; i < emptyCount; i++) {
      filled.push({ name: "", id: `empty-${i}` });
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

  const capitalizedGenres = fillEmptyRows(capitalizeWords(genres), Number(rows));
  const editBodyTemplate = (genre: any) => {
    if (!genre.name) return null;
    return (
      <div>
        <Button type="button" className="!p-3" severity="warning">
          <i className="pi pi-pencil !text-xl !font-semibold leading-5" />
        </Button>
      </div>
    );
  };

  const deleteBodyTemplate = (genre: any) => {
    if (!genre.name) return <div className="h-[46px]" />;
    return (
      <div>
        <Toast />
        <ConfirmPopup />
        <Button
          type="button"
          className="!p-3"
          severity="danger"
          onClick={(e: any) => confirm(e, genre.id)}
        >
          <i className="pi pi-trash !text-xl !font-semibold leading-5" />
        </Button>
      </div>
    );
  };

  return (
    <DataTable
      value={capitalizedGenres}
      scrollable
      scrollHeight="531px"
      className="bg-background-900"
    >
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
