"use client";
import { Button } from "primereact/button";
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
  hide,
  genres,
}: {
  hide: (e: React.SyntheticEvent) => void;
  genres: Promise<{ name: string; id: string }[] | undefined>;
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
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              onClick={() => {
                stepperRef.current.nextCallback();
                setStep(step + 1);
              }}
            />
          </StepperPanel>
          <StepperPanel header={stepTitles[1]}>
            <SecondStep onChange={handleChange} formData={formData} genres={genres} />
            <div className="flex pt-4 justify-between gap-4">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => {
                  stepperRef.current.prevCallback();
                  setStep(step - 1);
                }}
              />
              <Button
                label="Next"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() => {
                  stepperRef.current.nextCallback();
                  setStep(step + 1);
                }}
              />
            </div>
          </StepperPanel>
          <StepperPanel header={stepTitles[2]}>
            <ThirdStep onChange={handleChange} />
            <div className="flex pt-4 justify-content-between">
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                onClick={() => {
                  stepperRef.current.prevCallback();
                  setStep(step - 1);
                }}
              />
            </div>
          </StepperPanel>
        </Stepper>
        <div className="flex justify-end gap-2 p-2 pt-4">
          {step === 3 && (
            <Button
              type="submit"
              className="!bg-accent-700 text-content-900 hover:bg-accent-800 hover:text-content-950 !font-bold"
            >
              Crear
            </Button>
          )}
          <Button
            label="Cancel"
            type="button"
            onClick={(e) => hide(e)}
            text
            className="text-primary-50 !bg-background"
          ></Button>
        </div>
      </article>
    </form>
  );
}
