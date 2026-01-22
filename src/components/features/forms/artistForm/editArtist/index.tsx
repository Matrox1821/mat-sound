"use client";
import { FirstStep } from "./steps/FirstStep";
import { SecondStep } from "./steps/SecondStep";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useEffect, useRef, useState } from "react";
import { ThirdStep } from "./steps/ThirdStep";
import { updateArtistServer } from "@/actions/artist";
import { redirect } from "next/navigation";
import { toUpdateArtistFormData } from "@/shared/formData/artistForm";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";
import { ArtistFormData } from "@/types/form.types";
import { ArtistByPagination } from "@/types/artist.types";
import { useToast } from "@/shared/client/hooks/ui/useToast";
export const mapArtistToEditFormData = (artist: ArtistByPagination): ArtistFormData => {
  return {
    id: artist.id,
    name: artist.name,
    listeners: artist.listeners || 0,
    followers: artist.followersDefault || 0,
    description: artist.description ?? "",
    isVerified: artist.isVerified ?? false,
    avatar: null,
    mainCover: null,
    covers: null,
    regionalListeners: flattenObjectArray(artist.regionalListeners),
    socials: flattenObjectArray(artist.socials),
  };
};
const flattenObjectArray = (
  data?: Record<string, string>[] | Record<string, string> | null | any,
): Record<string, string> => {
  if (!data) return {};

  if (typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, string>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0 || typeof data[0] === "string") return {};

    return data.reduce((acc, curr) => {
      if (curr && typeof curr === "object" && !Array.isArray(curr)) {
        return { ...acc, ...curr };
      }
      return acc;
    }, {});
  }

  return {};
};

const stepTitles = ["Información", "Detalles", "Relaciones"];

const cleanStringArray = (arr: string[] | any): string[] | null => {
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const filtered = arr.filter((item) => typeof item === "string" && item.trim() !== "");

  return filtered.length > 0 ? filtered : null;
};
export function EditArtistForm({ artist }: { artist: ArtistByPagination }) {
  const parsedArtist = mapArtistToEditFormData(artist);
  const stepperRef = useRef<any>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ArtistFormData>(parsedArtist);
  const { createEntity, success, errors } = useCreateEntity({
    toFormData: toUpdateArtistFormData,
    serverAction: updateArtistServer,
    successMessage: "Artista editado con éxito",
    errorMessage: "Ocurrió un error al editar el artista",
  });
  const { success: successMessage, error } = useToast();
  const handleChange = <K extends keyof ArtistFormData>(field: K, value: ArtistFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEntity(formData);
  };

  useEffect(() => {
    if (success) {
      successMessage("Success!");
      redirect("/admin/artist");
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
      <article className="flex flex-col">
        <h2 className="text-lg">{stepTitles[0]}</h2>
        <Stepper
          ref={stepperRef}
          style={{ flexBasis: "5rem", paddingBottom: "0px !important" }}
          className="[&>.p-stepper-panels]:!pb-0 [&>div>div>span>section]:!h-[420px] [&>div>div>span>section]:!overflow-y-auto"
        >
          <StepperPanel header={stepTitles[0]}>
            <FirstStep
              onChange={handleChange}
              formData={formData}
              avatar={artist.avatar?.md}
              mainCover={artist.mainCover}
            />

            <div className="flex pt-4 justify-between gap-4">
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
            </div>
          </StepperPanel>
          <StepperPanel header={stepTitles[1]}>
            <SecondStep onChange={handleChange} formData={formData} />
            <div className="flex pt-4 justify-between gap-4">
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
                className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer"
                type="button"
                onClick={() => {
                  stepperRef.current.nextCallback();
                  setStep(step + 1);
                }}
              >
                Siguiente<i className="pi pi-arrow-right"></i>
              </button>
            </div>
          </StepperPanel>
          <StepperPanel header={stepTitles[2]}>
            <ThirdStep
              onChange={handleChange}
              formData={formData}
              covers={cleanStringArray(artist.covers)}
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
                Guardar Cambios
              </button>
            </div>
          </StepperPanel>
        </Stepper>
      </article>
    </form>
  );
}
