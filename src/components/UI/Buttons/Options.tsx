"use client";

import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";

export function Options({
  options,
  buttonClassName,
  iconClassName = "pi-ellipsis-h",
  optionsClassName,
  optionsPanelClassName,
}: {
  options: string[];
  buttonClassName?: string;
  iconClassName?: string;
  optionsPanelClassName?: string;
  optionsClassName?: string;
}) {
  const op = useRef<OverlayPanel>(null);

  return (
    <div>
      <button
        className={`flex items-center px-1 cursor-pointer hover:[&>i]:text-background-100 ${
          buttonClassName || ""
        }`}
        onClick={(e) => op.current?.toggle(e)}
      >
        <i className={`text-xl text-content-900 pi ${iconClassName || ""}`} />
      </button>
      <OverlayPanel
        ref={op}
        className={`after:!hidden !w-[200px] !shadow-sm before:!hidden !bg-background !border-background-800  [&>.p-overlaypanel-content]:!flex [&>.p-overlaypanel-content]:!flex-col [&>.p-overlaypanel-content]:!items-center [&>.p-overlaypanel-content]:!gap-1 [&>.p-overlaypanel-content]:!p-1 !rounded-lg ${
          optionsPanelClassName || ""
        }`}
      >
        {options.map((option, i) => (
          <button
            key={i}
            className={`w-full p-1 cursor-pointer hover:bg-background-950 rounded-sm text-start ${
              optionsClassName || ""
            }`}
          >
            {option}
          </button>
        ))}
      </OverlayPanel>
    </div>
  );
}
