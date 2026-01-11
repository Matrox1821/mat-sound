"use client";

import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";

export function Options({ options }: { options: string[] }) {
  const op = useRef<OverlayPanel>(null);

  return (
    <div>
      <button
        className="flex items-center px-1 cursor-pointer"
        onClick={(e) => op.current?.toggle(e)}
      >
        <i className="pi pi-ellipsis-h text-xl text-accent-50" />
      </button>
      <OverlayPanel
        ref={op}
        className="after:!hidden top-5 translate-x-6 !w-[200px] !shadow-sm before:!hidden !bg-background !border-background-800  [&>.p-overlaypanel-content]:!flex [&>.p-overlaypanel-content]:!flex-col [&>.p-overlaypanel-content]:!items-center [&>.p-overlaypanel-content]:!gap-1 [&>.p-overlaypanel-content]:!p-1 !rounded-lg "
      >
        {options.map((option, i) => (
          <button
            key={i}
            className="w-full p-1 cursor-pointer hover:bg-background-950 rounded-sm text-start"
          >
            {option}
          </button>
        ))}
      </OverlayPanel>
    </div>
  );
}
