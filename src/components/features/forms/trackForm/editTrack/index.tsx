"use client";
import { FirstStep } from "./steps/FirstStep";
import { SecondStep } from "./steps/SecondStep";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { ThirdStep } from "./steps/ThirdStep";
import { redirect, usePathname } from "next/navigation";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";
import { TrackByPagination } from "@/types/track.types";
import { TrackFormData } from "@/types/form.types";
import { toUpdateTrackFormData } from "@/shared/formData/trackForm";
import { updateTrackServer } from "@/actions/track";

export const mapTrackToEditFormData = (track: TrackByPagination): TrackFormData => {
  return {
    id: track.id,
    name: track.name,
    cover: null,
    song: null,

    releaseDate: track.releaseDate ? new Date(track.releaseDate).toISOString() : "",

    duration: track.duration ?? 0,
    reproductions: track.reproductions ?? 0,
    lyrics: track.lyrics ?? "",

    genres: track.genres?.map((g) => g.id) ?? [],
    artists: track.artists?.map((a) => a.id) ?? [],

    orderAndDisk: track.albums?.reduce((acc, curr) => {
      if (curr.album?.id) {
        acc[curr.album.id] = {
          order: curr.order,
          disk: curr.disk,
        };
      }
      return acc;
    }, {} as { [key: string]: { order: number; disk: number } }) ?? {},
  };
};


const stepTitles = ["Información", "Detalles", "Relaciones"];

export function EditTrackForm({ track, genres: genresPromise }: { track: TrackByPagination, genres: Promise<{ name: string; id: string }[] | undefined> }) {
  const parsedTrack = mapTrackToEditFormData(track);
  const stepperRef = useRef<any>(null);
  const [step, setStep] = useState(1);
  const genres = use(genresPromise)
  const [formData, setFormData] = useState<TrackFormData>(parsedTrack);
  const { createEntity, success } = useCreateEntity({
    toFormData: toUpdateTrackFormData,
    serverAction: updateTrackServer,
    successMessage: "Canción editada con éxito",
    errorMessage: "Ocurrió un error al editar la canción",
  });
  const pathname = usePathname();
  const handleChange = useCallback(<K extends keyof TrackFormData>(field: K, value: TrackFormData[K]) => {
    setFormData((prev) => {
      // 2. Solo actualizar si el valor es realmente distinto para evitar renders extra
      if (JSON.stringify(prev[field]) === JSON.stringify(value)) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEntity(formData);
  };

  useEffect(() => {
    if (success) {
      redirect(pathname);
    }
  }, [success, pathname]);
  return (
    <form
      onSubmit={handleSubmit}
      className="w-[750px] flex flex-col gap-4 text-xs overflow-auto"
      noValidate
    >
      <article className="flex flex-col">
        <h2 className="text-lg">{stepTitles[0]}</h2>
        <Stepper ref={stepperRef} style={{ flexBasis: "5rem", paddingBottom: "0px !important" }} className="[&>.p-stepper-panels]:!pb-0 [&>div>div>span>section]:!h-[420px] [&>div>div>span>section]:!overflow-y-auto">
          <StepperPanel header={stepTitles[0]}>
            <FirstStep onChange={handleChange} formData={formData} cover={track.cover?.md} song={track?.song || null} />
            <div className="flex pt-4 justify-between gap-4">

              <button
                className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer"
                type="button"
                onClick={() => {
                  stepperRef.current.nextCallback();
                  setStep(step + 1);
                }}
              >Siguiente<i className="pi pi-arrow-right"></i></button>
            </div>
          </StepperPanel>
          <StepperPanel header={stepTitles[1]}>
            <SecondStep onChange={handleChange} formData={formData} genres={genres} />
            <div className="flex pt-4 justify-between gap-4">
              <button
                className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer"
                type="button"
                onClick={() => {
                  stepperRef.current.prevCallback();
                  setStep(step - 1);
                }}
              ><i className="pi pi-arrow-left"></i>Atrás</button>
              <button
                className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer"
                type="button"
                onClick={() => {
                  stepperRef.current.nextCallback();
                  setStep(step + 1);
                }}
              >Siguiente<i className="pi pi-arrow-right"></i></button>
            </div>
          </StepperPanel>
          <StepperPanel header={stepTitles[2]} >
            <ThirdStep onChange={handleChange} />
            <div className="flex pt-4 gap-4">
              <button
                className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer"
                type="button"
                onClick={() => {
                  stepperRef.current.prevCallback();
                  setStep(step - 1);
                }}
              ><i className="pi pi-arrow-left"></i>Atrás</button>
              <button
                className="bg-accent-950/20 border border-accent-950/50 p-4 text-white hover:bg-accent-950/25 cursor-pointer font-bold rounded-md"
                type="submit"
              >Guardar Cambios</button>
            </div>

          </StepperPanel>
        </Stepper>
      </article>
    </form>
  );
}
