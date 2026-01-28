"use client";
import { CustomInputAdminForm } from "@components/features/inputs/CustomInputAdminForm";
import { genreCapitalize } from "@/shared/utils/helpers";
import { MultiSelect } from "primereact/multiselect";
import { use, useRef, useState } from "react";

export function SecondStep({
  formData,
  onChange,
  genres,
}: {
  formData: any;
  onChange: (field: any, value: any) => void;
  genres: Promise<{ name: string; id: string }[] | null>;
}) {
  const genresData = use(genres);
  const genresInputRef = useRef<HTMLInputElement>(null);
  const [genresSelected, setGenresSelected] = useState([]);

  const capitalizeWords = (arr: { name: string; id: string }[] | null) => {
    if (arr)
      return arr.map(({ name, id }) => ({
        name: genreCapitalize(name),
        id,
      }));
  };

  const capitalizedGenres = capitalizeWords(genresData);

  return (
    <section className="p-8 w-full flex flex-col gap-4">
      <div className="flex w-full gap-4 justify-between mt-4">
        <label className="flex flex-col gap-2 w-6/12 ">
          <span className="text-base">Fecha de lanzamiento:</span>
          <input
            type="date"
            name="releaseDate"
            className="fill-accent-950 date-input text-white rounded-md bg-background-950 border-2 border-content-700 h-9 p-2"
            required
            value={formData.releaseDate}
            onChange={(e: any) => onChange("releaseDate", e.target.value)}
          />
        </label>
        <input type="hidden" name="genres" value={formData.genres} ref={genresInputRef} />
        <MultiSelect
          value={genresSelected}
          onChange={(e: any) => {
            const selected = e.target.value;
            setGenresSelected(selected);
            const ids = selected.map(({ id }: { id: string }) => id);
            onChange("genres", ids);
            if (genresInputRef.current) {
              genresInputRef.current.value = JSON.stringify(ids);
            }
          }}
          options={capitalizedGenres}
          optionLabel="name"
          placeholder="Select Genres"
          maxSelectedLabels={3}
          className="w-full md:w-20rem"
        />
      </div>
      <div className="flex w-full gap-4">
        <CustomInputAdminForm
          title="Duracion de cancion en segundos:"
          name="duration"
          type="number"
          isRequired
          inBox
          value={formData.duration}
          onChange={(val: any) => onChange("duration", parseInt(val))}
        />
        <CustomInputAdminForm
          title="Cantidad de reproducciones:"
          name="reproductions"
          type="number"
          inBox
          isRequired
          value={formData.reproductions}
          onChange={(val: any) => onChange("reproductions", parseInt(val))}
        />
      </div>
      <CustomInputAdminForm
        title="Letra de la canción:"
        name="lyrics"
        type="textarea"
        value={formData.lyrics}
        onChange={(val: any) => onChange("lyrics", val)}
        isRequired
      />
    </section>
  );
}
