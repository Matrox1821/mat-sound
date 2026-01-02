import CustomInputAdminForm from "@/components/UI/Inputs/CustomInputAdminForm";

export function SecondStep({
  formData,
  onChange,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
}) {
  return (
    <section className="p-8 w-full">
      <div className="flex w-full gap-4 justify-between mt-4 flex-col overflow-auto max-h-[320px]">
        <div className="flex w-full gap-4">
          <CustomInputAdminForm
            title="Oyentes mensuales:"
            name="listeners"
            type="number"
            value={formData.listeners}
            onChange={(val: any) => onChange("listeners", val)}
            isRequired
            inBox
          />
          <CustomInputAdminForm
            title="Seguidores:"
            name="followers"
            type="number"
            value={formData.followers}
            onChange={(val: any) => onChange("followers", val)}
            inBox
            isRequired
          />
        </div>
        <CustomInputAdminForm
          title="Descripción:"
          name="description"
          type="textarea"
          isRequired
          value={formData.description}
          onChange={(val: any) => onChange("description", val)}
        />
        <CustomInputAdminForm
          title="Está verificado?"
          name="is_verified"
          type="checkbox"
          value={formData.is_verified}
          onChange={(checked) => onChange("is_verified", checked)}
        />
      </div>
    </section>
  );
}
