import CustomInputAdminForm from "@components/features/inputs/CustomInputAdminForm";
export function FirstStep({
  formData,
  onChange,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
}) {
  return (
    <section className="p-8 w-full">
      <div className="flex w-full gap-4 justify-between mt-8 flex-col">
        <CustomInputAdminForm
          title="Nombre del álbum:"
          name="name"
          type="text"
          value={formData.name}
          onChange={(val) => onChange("name", val)}
          isRequired
        />
        <div className="flex w-full gap-4 justify-between mt-4">
          <CustomInputAdminForm
            title="Imagen del Álbum:"
            name="cover"
            type="file"
            value={formData.cover}
            onChange={(val) => onChange("cover", val)}
            isRequired
          />
          <label className="flex flex-col gap-2 w-6/12 ">
            <span className="text-base">Fecha de lanzamiento:</span>
            <input
              type="date"
              name="releaseDate"
              className="fill-accent-950 date-input text-white rounded-md bg-background-950 border border-background-100/40 h-10 p-2"
              onChange={(e: any) => onChange("releaseDate", e.target.value)}
              required
            />
          </label>
        </div>
      </div>
    </section>
  );
}
