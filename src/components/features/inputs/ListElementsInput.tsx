"use client";
import { useRef, useState } from "react";

export function ListElementsInput({ name }: { name: string }) {
  const [elements, setElements] = useState<string[]>([]);
  const valueInput = useRef<HTMLInputElement>(null);

  const addElement = () => {
    const valueInputValue = valueInput.current?.value as string;

    const doesNotExistInputValue = !valueInput.current || valueInputValue === "";

    if (doesNotExistInputValue) return;

    setElements((prev) => [...prev, valueInputValue]);
  };

  const removeElement = (elementToDelete: string) => {
    if (elements.length === 0) return;

    const newElement = elements.filter((element) => element !== elementToDelete);
    setElements(newElement);
  };

  return (
    <div className="w-full flex flex-col">
      <label className="grid grid-cols-12 relative w-full z-10">
        <input value={JSON.stringify(elements) || "none"} name={name} className="hidden" readOnly />
        <input
          className="col-start-1 col-end-12 input-value bg-background-950 border-2 border-[rgb(176,178,186)] border-r-0 h-8 focus-visible:border-accent-900 focus:border-2 
          rounded-l-md
          outline-none py-4 pl-1 "
          type="text"
          ref={valueInput}
        />
        <button
          className="relative border-2 bg-background-950 pb-[.15rem] rounded-s-none rounded-md border-[rgb(176,178,186)] active:border-accent-900 active:text-accent-900"
          onClick={addElement}
          type="button"
        >
          +
        </button>
      </label>

      {elements.length > 0 && (
        <div className="border-2 border-[rgb(176,178,186)] rounded-b-md pt-2 -translate-y-3 z-0 ">
          {elements.map((elementName, i) => (
            <div
              className={`${
                i > 0 ? "border-t-2 border-t-[rgb(176,178,186)]" : ""
              } grid grid-cols-12 relative`}
              key={elementName + i}
            >
              <span className="!border-x-4 !border-x-transparent col-start-1 col-end-12 flex items-center w-auto border-r-0 border-[rgb(176,178,186)] rounded-md rounded-e-none h-8 focus-visible:border-accent-900 focus:border-2 outline-none py-4 pl-1 gap-2 overflow-hidden text-ellipsis">
                {elementName}
              </span>
              <button
                className="relative ml-[0.1rem] bg-background-950 pb-[.15rem] rounded-s-none rounded-md border-[rgb(176,178,186)] border-l-2 active:border-accent-900 active:text-accent-900"
                onClick={() => removeElement(elementName)}
                type="button"
              >
                -
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
