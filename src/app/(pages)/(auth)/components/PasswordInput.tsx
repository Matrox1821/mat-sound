"use client";
import { PasswordVisibility } from "@/components/ui/icons/PasswordVisibility";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

type PasswordInputProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
};

export function PasswordInput({ id, name, label, defaultValue }: PasswordInputProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <FloatLabel>
      <InputText
        id={id}
        name={name}
        className="!w-full !bg-background-800/40 !border-background-50/30"
        type={showPass ? "text" : "password"}
        defaultValue={defaultValue}
      />
      <label htmlFor={id}>{label}</label>
      <button
        className="absolute! h-full top-0 right-0 flex-col justify-end pr-3 pb-1 cursor-pointer"
        onClick={() => setShowPass((prev) => !prev)}
        type="button"
      >
        <PasswordVisibility isHidden={showPass} className="h-8 w-6 fill-background-50/70" />
      </button>
    </FloatLabel>
  );
}
