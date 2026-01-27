"use client";
import { FirstStep } from "./steps/FirstStep";
import { SecondStep } from "./steps/SecondStep";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useCallback, useEffect, useRef, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { createAlbumServer } from "@/actions/album";
import { initialAlbumFormData, toAlbumFormData } from "@/shared/formData/albumForm";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";
import { AlbumFormData } from "@shared-types/form.types";

const stepTitles = ["Información", "Relaciones"];

export function CreateAlbumForm() {
  const stepperRef = useRef<any>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AlbumFormData>(initialAlbumFormData);

  const { createEntity, success } = useCreateEntity({
    toFormData: toAlbumFormData,
    serverAction: createAlbumServer,
    successMessage: "Album creado con éxito",
    errorMessage: "Ocurrió un error al crear el album",
  });
  const pathname = usePathname();

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
      redirect(pathname);
    }
  }, [success, pathname]);
  return (
    <form
      onSubmit={handleSubmit}
      className="w-[750px] flex flex-col gap-4 text-xs overflow-auto border border-background-100/30 p-4 rounded-md"
    >
      <article className="flex flex-col">
        <h2 className="text-lg">{stepTitles[0]}</h2>
        <Stepper
          ref={stepperRef}
          style={{ flexBasis: "5rem" }}
          className="[&>.p-stepper-panels]:!pb-0 [&>div>div>span>section]:!h-[420px] [&>div>div>span>section]:!overflow-y-auto"
        >
          <StepperPanel header={stepTitles[0]}>
            <FirstStep onChange={handleChange} formData={formData} />
            <div className="flex pt-4 justify-between gap-4 ">
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
            <SecondStep onChange={handleChange} />
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
                Crear
              </button>
            </div>
          </StepperPanel>
        </Stepper>
      </article>
    </form>
  );
}
