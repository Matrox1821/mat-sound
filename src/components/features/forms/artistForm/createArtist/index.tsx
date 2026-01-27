"use client";
import { FirstStep } from "./Steps/FirstStep";
import { SecondStep } from "./Steps/SecondStep";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useEffect, useRef, useState } from "react";
import { ThirdStep } from "./Steps/ThirdStep";
import { createArtistServer } from "@/actions/artist";
import { redirect, usePathname } from "next/navigation";
import { initialArtistFormData, toArtistFormData } from "@/shared/formData/artistForm";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";
import { ArtistFormData } from "@shared-types/form.types";

const stepTitles = ["Información", "Detalles", "Relaciones"];

export function CreateArtistForm() {
  const stepperRef = useRef<any>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ArtistFormData>(initialArtistFormData);

  const { createEntity, success } = useCreateEntity({
    toFormData: toArtistFormData,
    serverAction: createArtistServer,
    successMessage: "Artista creado con éxito",
    errorMessage: "Ocurrió un error al crear el artista",
  });
  const pathname = usePathname();

  const handleChange = <K extends keyof ArtistFormData>(field: K, value: ArtistFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
      className="w-[750px] flex flex-col gap-4 text-xs overflow-auto border border-background-100/40 rounded-md p-4"
    >
      <article className="flex flex-col">
        <h2 className="text-lg">{stepTitles[0]}</h2>
        <Stepper
          ref={stepperRef}
          style={{ flexBasis: "5rem", paddingBottom: "0px !important" }}
          className="[&>.p-stepper-panels]:!pb-0 [&>div>div>span>section]:!h-[420px] [&>div>div>span>section]:!overflow-y-auto"
        >
          <StepperPanel header={stepTitles[0]}>
            <FirstStep onChange={handleChange} formData={formData} />
            <div className="flex pt-4 justify-between gap-4 ">
              <button
                className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer border border-transparent"
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
                className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer border border-transparent"
                type="button"
                onClick={() => {
                  stepperRef.current.prevCallback();
                  setStep(step - 1);
                }}
              >
                <i className="pi pi-arrow-left"></i>Atrás
              </button>
              <button
                className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer border border-transparent"
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
            <ThirdStep onChange={handleChange} formData={formData} />
            <div className="flex pt-4 gap-4">
              <button
                className="flex gap-2 items-center bg-background-700 p-4 rounded-md cursor-pointer borer border-transparent"
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
                Crear
              </button>
            </div>
          </StepperPanel>
        </Stepper>
      </article>
    </form>
  );
}
