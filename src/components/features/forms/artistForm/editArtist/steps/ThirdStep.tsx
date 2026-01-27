"use client";
import { FormDialog } from "@components/features/dialogs/FormDialog";
import CustomInputAdminForm from "@components/features/inputs/CustomInputAdminForm";
import { JsonElementsInput } from "@components/features/inputs/JsonElementsInput";
import { JsonBulkEditor } from "../JsonBulkEditor";

export function ThirdStep({
  formData,
  onChange,
  covers,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
  covers?: string[] | null;
}) {
  const handleJsonConfirm = (field: string, newData: Record<string, string>) => {
    onChange(field, newData);
  };
  return (
    <section className="p-8 w-full h-[400px] overflow-auto flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <span>Oyentes regionales:</span>
          <span className="flex gap-2 items-center">
            <span>Agregar JSON:</span>
            <FormDialog
              newButton={{
                buttonImage: <i className="pi pi-book"></i>,
                buttonStyle:
                  "bg-background-800 w-8 h-8 flex items-center justify-center rounded-sm cursor-pointer hover:bg-background-800/70",
              }}
            >
              <JsonBulkEditor onConfirm={(data) => handleJsonConfirm("regionalListeners", data)} />
            </FormDialog>
          </span>
        </div>
        <JsonElementsInput
          title=""
          name="regionalListeners"
          value={formData.regionalListeners}
          onChange={(val) => onChange("regionalListeners", val)}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <span>Redes sociales:</span>
          <span className="flex gap-2 items-center">
            <span>Agregar JSON:</span>
            <FormDialog
              newButton={{
                buttonImage: <i className="pi pi-book"></i>,
                buttonStyle:
                  "bg-background-800 w-8 h-8 flex items-center justify-center rounded-sm cursor-pointer hover:bg-background-800/70",
              }}
            >
              <JsonBulkEditor onConfirm={(data) => handleJsonConfirm("socials", data)} />
            </FormDialog>
          </span>
        </div>
        <JsonElementsInput
          title=""
          name="socials"
          value={formData.socials}
          onChange={(val) => onChange("socials", val)}
        />
      </div>

      <CustomInputAdminForm
        title="Portadas:"
        name="covers"
        type="file"
        value={formData.covers}
        onChange={(val) => onChange("covers", val)}
        isMultiple
        isRequired
        defaultImages={covers || null}
      />
    </section>
  );
}
