"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function Filter({ filters }: { filters: { id: string; label: string }[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  useState(() => {
    const initial: Record<string, boolean> = {};
    filters.forEach(({ id }) => {
      initial[id] = searchParams.get(id) === "true";
    });
    setChecked(initial);
  });

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    filters.forEach(({ id }) => {
      if (checked[id]) {
        params.set(id, "true");
      } else {
        params.delete(id);
      }
    });

    router.push(`?${params.toString()}`);
  };
  return (
    <div className="absolute w-[320px] bg-background! border! border-background-100/30! right-10! h-auto! rounded-lg! flex flex-col p-6 top-1/5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">Filtros</h2>
        <hr className="text-background-700 w-full" />
        <div className="flex flex-col gap-4 py-4">
          {filters.map(({ id, label }) => (
            <label key={id} className="flex gap-4 items-center relative">
              <input
                type="checkbox"
                id={id}
                name={id}
                checked={checked[id] ?? false}
                onChange={(e) => setChecked((prev) => ({ ...prev, [id]: e.target.checked }))}
                className="h-5 w-5 filter hidden"
              />
              <span className="select-none">{label}</span>
              <span className="cross"></span>
            </label>
          ))}
        </div>
        <button
          className="bg-contrast-800/20 rounded-md p-2 border border-contrast-700 cursor-pointer hover:bg-contrast-800/30 active:scale-102"
          onClick={handleApply}
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}
