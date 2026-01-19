"use client";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";

export type OptionItem = {
  label?: string;
  onClick?: () => void;
  className?: string;
  render?: () => React.ReactNode;
  image?: React.ReactNode;
  iconPosition?: "left" | "right";
  as?: "button" | "div";
};

export function DropdownMenu({
  options,
  buttonClassName,
  iconClassName = "pi-ellipsis-h",
  optionsPanelClassName,
}: {
  options: OptionItem[];
  buttonClassName?: string;
  iconClassName?: string;
  optionsPanelClassName?: string;
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
        <i className={`text-xl text-content-900 pi ${iconClassName}`} />
      </button>

      <OverlayPanel
        ref={op}
        className={`!bg-background !border-background-800 !shadow-lg !rounded-lg [&>div]:!p-2 before:!content-none after:!content-none ${
          optionsPanelClassName || ""
        }`}
      >
        <div className="flex flex-col gap-1 p-1 w-[220px]">
          {options.map((option, i) => {
            if (option.render) {
              return <div key={i}>{option.render()}</div>;
            }

            const Component = option.as || "button";
            const isLeft = option.iconPosition === "left";

            return (
              <Component
                key={i}
                onClick={option.onClick}
                className={`w-full p-2 flex items-center gap-3 hover:bg-background-950 rounded-md transition-colors text-sm text-start ${
                  option.className || ""
                }`}
              >
                {isLeft && option.image}
                <span className="flex-1">{option.label}</span>
                {!isLeft && option.image}
              </Component>
            );
          })}
        </div>
      </OverlayPanel>
    </div>
  );
}
