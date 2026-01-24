"use client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { use } from "react";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { genreCapitalize } from "@/shared/utils/helpers";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { deleteGenreServer } from "@/actions/genre";

export default function GenresTable({
  data,
  rows = "6",
}: {
  data: Promise<{ name: string; id: string }[] | null>;
  rows?: string;
}) {
  const genres = use(data);
  const { message, error } = useToast();
  if (!genres) return;

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

  const handleDelete = async ({ id, name }: { id: string; name: string }) => {
    try {
      await deleteGenreServer(id);
      message(`Género ${name} eliminado.`);
    } catch {
      error(`Error al eliminar el género ${name}.`);
    }
  };
  const confirm = async ({ event, id, name }: { event: any; id: string; name: string }) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Quieres eliminar este género?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete({ id, name }),
    });
  };

  const capitalizedGenres = fillEmptyRows(capitalizeWords(genres), Number(rows));

  const deleteBodyTemplate = (genre: any) => {
    if (!genre.name) return <div className="h-[46px]" />;
    return (
      <div>
        <ConfirmPopup />
        <button
          type="button"
          className="h-11 w-11 bg-red-500/20 border border-red-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-500/10"
          onClick={(event: any) => confirm({ event, id: genre.id, name: genre.name })}
        >
          <i className="pi pi-trash !text-xl !text-white leading-5" />
        </button>
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
        className="w-full bg-background-900 !border-background"
      ></Column>
      <Column
        header="Borrar"
        body={deleteBodyTemplate}
        className="w-20 bg-background-900 !border-background"
      ></Column>
    </DataTable>
  );
}
