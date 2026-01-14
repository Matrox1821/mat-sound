"use client";
import { Button } from "primereact/button";
import { FirstStep } from "./Steps/FirstStep";
import { SecondStep } from "./Steps/SecondStep";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useEffect, useRef, useState } from "react";
import { ThirdStep } from "./Steps/ThirdStep";
import { createArtistServer } from "@/actions/artist";
import { redirect, usePathname } from "next/navigation";
import { initialArtistFormData, toArtistFormData } from "@/shared/formData/artistForm";
import { ArtistFormData } from "@/types/apiTypes";
import { useCreateEntity } from "@/shared/client/hooks/ui/useCreateEntity";

const stepTitles = ["Información", "Detalles", "Relaciones"];

export function ArtistForm({ hide }: { hide: (e: React.SyntheticEvent) => void }) {
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
            <SecondStep onChange={handleChange} formData={formData} />
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
            <ThirdStep onChange={handleChange} formData={formData} />
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
