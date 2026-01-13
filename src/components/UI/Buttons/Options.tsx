"use client";

import { useCreatePlaylistDialogStore } from "@/store/createPlaylistDialogStore";
import { OverlayPanel } from "primereact/overlaypanel";
import { JSX, useRef } from "react";

export function Options({
  options,
  buttonClassName,
  iconClassName = "pi-ellipsis-h",
  baseOptionsClassName,
  optionsPanelClassName,
}: {
  options: {
    label: string;
    buttonClassName?: string;
    icon?: React.ReactElement;
    iconPosition?: "left" | "right";
    onClick?: () => void;
    trackId?: string;
    image?: JSX.Element;
    imagePosition?: "left" | "right";
    select?: React.ReactElement;
  }[];
  buttonClassName?: string;
  iconClassName?: string;
  optionsPanelClassName?: string;
  baseOptionsClassName?: string;
}) {
  const op = useRef<OverlayPanel>(null);
  const { toggle, setTrackId } = useCreatePlaylistDialogStore((state) => state);

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
        {options.map((option, i) => {
          if (option.icon && option.iconPosition)
            return (
              <button
                key={i}
                onClick={() => {
                  if (option.trackId) {
                    setTrackId(option.trackId);
                    toggle();
                  }
                  if (option.onClick) option.onClick();
                }}
                className={`w-full p-1 cursor-pointer hover:bg-background-950 rounded-sm text-start ${
                  baseOptionsClassName || ""
                } ${option.buttonClassName || ""}`}
              >
                <span className="flex items-center gap-2">
                  {option.iconPosition === "left" ? option.icon : option.label}
                  {option.iconPosition === "left" ? option.label : option.icon}
                </span>
                {option.select}
              </button>
            );
          if (option.image && option.imagePosition)
            return (
              <div
                key={i}
                className={`w-full p-1 cursor-pointer hover:bg-background-950 rounded-sm text-start ${
                  baseOptionsClassName || ""
                } ${option.buttonClassName || ""}`}
              >
                <span className="flex items-center gap-2">
                  {option.imagePosition === "left" ? option.image : option.label}
                  {option.imagePosition === "left" ? option.label : option.image}
                </span>
                {option.select}
              </div>
            );
        })}
      </OverlayPanel>
    </div>
  );
}
