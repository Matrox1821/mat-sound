"use client";
import { FirstStep } from "./steps/FirstStep";
import { SecondStep } from "./steps/SecondStep";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useEffect, useRef, useState } from "react";
import { ThirdStep } from "./steps/ThirdStep";
import { createTrackServer } from "@/actions/track";
import { initialTrackFormData, toTrackFormData } from "@/shared/formData/trackForm";
import { redirect, usePathname } from "next/navigation";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";
import { TrackFormData } from "@/types/form.types";

const stepTitles = ["Información", "Detalles", "Relaciones"];

export function CreateTrackForm({
  genres,
}: {
  genres: Promise<{ name: string; id: string }[] | null>;
}) {
  const stepperRef = useRef<any>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TrackFormData>(initialTrackFormData);
  const { createEntity, success } = useCreateEntity({
    toFormData: toTrackFormData,
    serverAction: createTrackServer,
    successMessage: "Canción creada con éxito",
    errorMessage: "Ocurrió un error al crear la canción",
  });
  const pathname = usePathname();

  const handleChange = <K extends keyof TrackFormData>(field: K, value: TrackFormData[K]) => {
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
    <form onSubmit={handleSubmit} className="w-[750px] flex flex-col gap-4 text-xs overflow-auto">
      <article className="flex flex-col">
        <h2 className="text-lg">{stepTitles[0]}</h2>

        <Stepper ref={stepperRef} style={{ flexBasis: "5rem" }}>
          <StepperPanel header={stepTitles[0]}>
            <FirstStep onChange={handleChange} formData={formData} />
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
          </StepperPanel>
          <StepperPanel header={stepTitles[1]}>
            <SecondStep onChange={handleChange} formData={formData} genres={genres} />
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
          </StepperPanel>
          <StepperPanel header={stepTitles[2]}>
            <ThirdStep onChange={handleChange} />
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
