"use client";
import { FirstStep } from "./steps/FirstStep";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";
import { AlbumFormData } from "@/types/form.types";
import { AlbumByPagination } from "@/types/album.types";
import { toUpdateAlbumFormData } from "@/shared/formData/albumForm";
import { updateAlbumServer } from "@/actions/album";
import { SecondStep } from "./steps/SecondStep";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useToast } from "@/shared/client/hooks/ui/useToast";
export const mapAlbumToEditFormData = (album: AlbumByPagination): AlbumFormData => {
  const tracksOrder: { [key: string]: { order: number; disk: number } } = {};

  album.tracks?.map(({ track, order, disk }) => {
    tracksOrder[track.id] = { order, disk };
  });
  return {
    id: album.id,
    name: album.name,
    releaseDate: album.releaseDate?.toString() || "",
    cover: null,
    artists: album.artists?.map((artist) => artist.id),
    tracks: album.tracks?.map(({ track }) => track.id),
    tracksOrder,
  };
};

const stepTitles = ["Información", "Relaciones"];

export function EditAlbumForm({ album }: { album: AlbumByPagination }) {
  const parsedAlbum = mapAlbumToEditFormData(album);
  const stepperRef = useRef<any>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AlbumFormData>(parsedAlbum);
  const { createEntity, success, errors } = useCreateEntity({
    toFormData: toUpdateAlbumFormData,
    serverAction: updateAlbumServer,
    successMessage: "Album editado con éxito",
    errorMessage: "Ocurrió un error al editar el album",
  });
  const { error, success: successMessage } = useToast();

  const handleChange = useCallback(
    <K extends keyof AlbumFormData>(field: K, value: AlbumFormData[K]) => {
      setFormData((prev) => {
        if (JSON.stringify(prev[field]) === JSON.stringify(value)) {
          return prev;
        }

        return {
          ...prev,
          [field]: value,
        };
      });
    },
    [],
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEntity(formData);
  };

  useEffect(() => {
    if (success) {
      successMessage("Success!");
      /* redirect("/admin/track"); */
    }
    if (errors.length !== 0) {
      Object.entries(errors).forEach(([key, value]) => {
        error(key);
      });
    }
  }, [success, errors, successMessage, error]);
  return (
    <form
      onSubmit={handleSubmit}
      className="w-[750px] flex flex-col gap-4 text-xs overflow-auto"
      noValidate
    >
      <article className="flex flex-col items-end">
        {/* <h2 className="text-lg">{stepTitles[0]}</h2> */}

        <FirstStep onChange={handleChange} formData={formData} cover={album.cover?.sm} />
        <div className="flex pt-4 justify-between gap-4 ">
          <button
            className="bg-accent-950/20 border border-accent-950/50 p-4 text-white hover:bg-accent-950/25 cursor-pointer font-bold rounded-md flex"
            type="submit"
          >
            Guardar cambios
          </button>
        </div>
        {/*  <Stepper
          ref={stepperRef}
          style={{ flexBasis: "5rem" }}
          className="[&>.p-stepper-panels]:!pb-0 [&>div>div>span>section]:!h-[420px] [&>div>div>span>section]:!overflow-y-auto"
          >
          <StepperPanel header={stepTitles[0]}>
          <button
            className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer"
            type="button"
            onClick={() => {
              stepperRef.current.nextCallback();
              setStep(step + 1);
            }}
          >
            Siguiente<i className="pi pi-arrow-right"></i>
          </button>
          </StepperPanel>
          <StepperPanel header={stepTitles[1]}>
            <SecondStep
              onChange={handleChange}
              formData={formData}
              albumArtists={album.artists || []}
              albumTracks={album.tracks?.map(({ track }) => track) || []}
            />
            <div className="flex pt-4 gap-4">
              <button
                className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer"
                type="button"
                onClick={() => {
                  stepperRef.current.prevCallback();
                  setStep(step - 1);
                }}
              >
                <i className="pi pi-arrow-left"></i>Atrás
              </button>
              <button
                className="bg-accent-950/20 border border-accent-950/50 p-4 text-white hover:bg-accent-950/25 cursor-pointer font-bold rounded-md flex"
                type="submit"
              >
                Guardar cambios
              </button>
            </div>
          </StepperPanel>
        </Stepper> */}
      </article>
    </form>
  );
}
