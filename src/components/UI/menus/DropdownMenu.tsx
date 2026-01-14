"use client";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";

// Definimos un tipo para la opción más flexible
export type OptionItem = {
  label?: string;
  onClick?: () => void;
  className?: string;
  render?: () => React.ReactNode; // Si esto existe, ignoramos lo demás
  icon?: React.ReactNode;
  image?: React.ReactNode;
  iconPosition?: "left" | "right";
  // Agregamos un campo para identificar si es un div o button si no hay render
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
            // 1. Si el usuario pasa un render personalizado, lo usamos directamente
            if (option.render) {
              return <div key={i}>{option.render()}</div>;
            }

            // 2. Si no, usamos un componente genérico (button por defecto o div)
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
                {isLeft && (option.icon || option.image)}
                <span className="flex-1">{option.label}</span>
                {!isLeft && (option.icon || option.image)}
              </Component>
            );
          })}
        </div>
      </OverlayPanel>
    </div>
  );
}
