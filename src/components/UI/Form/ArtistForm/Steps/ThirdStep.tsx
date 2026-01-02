"use client";
import CustomInputAdminForm from "@/components/UI/Inputs/CustomInputAdminForm";
import { JsonElementsInput } from "@/components/UI/Inputs/JsonElementsInput";

export function ThirdStep({
  formData,
  onChange,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
}) {
  return (
    <section className="p-8 w-full h-[400px] overflow-auto">
      <JsonElementsInput
        title="Oyentes regionales:"
        name="regional_listeners"
        value={formData.regional_listeners}
        onChange={(val) => onChange("regional_listeners", val)}
      />
      <JsonElementsInput
        title="Redes sociales:"
        name="socials"
        value={formData.socials}
        onChange={(val) => onChange("socials", val)}
      />
      <CustomInputAdminForm
        title="Portadas:"
        name="covers"
        type="file"
        value={formData.covers}
        onChange={(val) => onChange("covers", val)}
        isMultiple
        isRequired
      />
    </section>
  );
}
