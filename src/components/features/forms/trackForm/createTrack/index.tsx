"use client";
import { FirstStep } from "./steps/FirstStep";
import { SecondStep } from "./steps/SecondStep";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThirdStep } from "./steps/ThirdStep";
import { createTrackServer } from "@/actions/track";
import { initialTrackFormData, toTrackFormData } from "@/shared/formData/trackForm";
import { redirect, usePathname } from "next/navigation";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";
import { TrackFormData } from "@shared-types/form.types";

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

  const handleChange = useCallback(
    <K extends keyof TrackFormData>(field: K, value: TrackFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
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
  }, [success]);

  const stepOptions = {
    action: () => ({
      className: `flex flex-col items-center pr-4 border-none bg-transparent cursor-pointer focus:shadow-none`,
    }),
    number: ({ context }: any) => ({
      className: `
                w-8 h-8 rounded-full flex items-center justify-center font-semibold pt-.5 transition-colors duration-200
                ${context.active ? "bg-contrast-900 text-gray-300 font-extrabold scale-101" : ""}
                ${context.highlighted ? "bg-contrast-600/80 text-white" : ""}
                ${!context.highlighted && !context.active ? "bg-contrast-900/50 text-gray-300" : ""}
              `,
    }),
    // El texto del título (header)
    title: ({ context }: any) => ({
      className: `text-sm font-medium ${context.active || context.highlighted ? "text-white" : "text-gray-500"}`,
    }),
    // La línea conectora entre pasos
    separator: ({ context }: any) => ({
      className: `mb-6 h-0.5 flex-1 transition-colors duration-200 ${context.highlighted ? "bg-contrast-700" : "bg-gray-700"}`,
    }),
  };

  return (
    <form onSubmit={handleSubmit} className="w-[750px] flex flex-col gap-4 text-xs overflow-auto">
      <article className="flex flex-col">
        <Stepper ref={stepperRef} style={{ flexBasis: "5rem" }}>
          <StepperPanel header={stepTitles[0]} pt={stepOptions}>
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
          <StepperPanel header={stepTitles[1]} pt={stepOptions}>
            <SecondStep onChange={handleChange} formData={formData} genres={genres} />
            <div className="flex pt-4 gap-4">
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
          <StepperPanel header={stepTitles[2]} pt={stepOptions}>
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
