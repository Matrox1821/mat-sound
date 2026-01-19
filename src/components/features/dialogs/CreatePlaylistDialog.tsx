"use client";
import { createPlaylist as createUserPlaylist } from "@/actions/user";
import { useToast } from "@/shared/client/hooks/ui/useToast";
import { useCreatePlaylistDialogStore } from "@/store/createPlaylistDialogStore";
import { usePathname } from "next/navigation";
import { Dialog as PrimeReactDialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useState, useTransition } from "react";

export function CreatePlaylistDialog() {
  const pathname = usePathname();

  const options = [
    { name: "Privada", icon: "pi-lock" },
    { name: "Pública", icon: "pi-globe" },
  ];
  const { isVisible, setIsVisible, trackId } = useCreatePlaylistDialogStore();
  const [selectedVisibility, setSelectedVisibility] = useState(options[0]);
  const [value, setValue] = useState("");

  const [isPending, startTransition] = useTransition();

  // ... (tus estados)
  const { error: toastError, message: toastSuccess } = useToast(); // Traemos el toast success

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || isPending) return;

    startTransition(async () => {
      try {
        await createUserPlaylist(trackId, value, pathname);
        toastSuccess(`Playlist "${value}" creada con éxito`);
        setIsVisible(false);
        setValue("");
      } catch {
        toastError("No se pudo crear la playlist");
      }
    });
  };

  const selectedOptionTemplate = (option: { name: string; icon: string }, props: any) => {
    if (option) {
      return (
        <div className="flex flex-col p-0">
          <span className="text-[10px] text-background-200">Visibilidad</span>
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const optionIconTemplate = (option: { name: string; icon: string }) => {
    return (
      <div className="flex items-center">
        <i className={`mr-2 flag flag pi ${option.icon}`} style={{ width: "18px" }} />
        <div>{option.name}</div>
      </div>
    );
  };

  return (
    <PrimeReactDialog
      className="!border-0"
      visible={isVisible}
      modal
      onHide={() => setIsVisible(false)}
      closeIcon={true}
      content={({ hide }) => (
        <div
          className="flex flex-col p-3 gap-6 bg-background-950 w-[320px]"
          style={{
            borderRadius: "12px",
          }}
        >
          <h2 className="p-3 text-lg font-semibold">Nueva playlist</h2>
          <form className="flex flex-col gap-8 p-3" onSubmit={handleCreate}>
            <FloatLabel
              className="
                [&>label]:!left-3 
                [&>input:focus~label]:!top-4
                [&>input:focus~label]:!text-[10px]
                [&>input.p-filled~label]:!top-4
                [&>input.p-filled~label]:!text-[10px]
              "
            >
              <InputText
                id="name"
                name="name"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="!w-full !bg-background-900 !border-background-50/30 !pt-5"
              />
              <label htmlFor="name" className="">
                Título
              </label>
            </FloatLabel>
            <Dropdown
              value={selectedVisibility} // 3. Vincular al estado
              options={options}
              onChange={(e) => setSelectedVisibility(e.value)} // 4. Actualizar el estado
              optionLabel="visibility"
              className="w-full !rounded-lg focus:!ring-0 focus:!shadow-none focus:!border-background-50/30 !outline-none !p-0 [&>.p-dropdown-label]:!pl-2 [&>.p-dropdown-label]:!py-2"
              itemTemplate={optionIconTemplate}
              valueTemplate={selectedOptionTemplate}
              panelClassName="!rounded-md [&>div]:!rounded-md"
            />
            <div className="flex w-full gap-2">
              <button
                type="button"
                onClick={(e) => hide(e)}
                className="text-primary-50 bg-background-950 border-[1px] border-background-50/40 font-semibold h-9 rounded-full w-1/2 flex items-center justify-center cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={(e) => {
                  handleCreate(e);
                  hide(e);
                }}
                disabled={value === "" || isPending}
                className="bg-content-900/95 text-background-900 font-bold rounded-full w-1/2 h-9 flex items-center justify-center cursor-pointer disabled:!bg-background/60 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? <i className="pi pi-spin pi-spinner text-lg"></i> : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}
    ></PrimeReactDialog>
  );
}
