import { useRef, useState } from "react";

export function JsonElementsInput({ name }: { name: string }) {
  const [elements, setElements] = useState<{ [key: string]: string }>();
  const keyInput = useRef<HTMLInputElement>(null);
  const valueInput = useRef<HTMLInputElement>(null);

  const addElement = () => {
    const keyInputValue = keyInput.current?.value as string;
    const valueInputValue = valueInput.current?.value as string;

    const doesNotExistInputs = !keyInput.current || !valueInput.current;
    const inputsAreEmpty = keyInputValue === "" || valueInputValue === "";

    if (doesNotExistInputs || inputsAreEmpty) return;

    setElements((prev) => ({ ...prev, [keyInputValue]: valueInputValue }));
  };

  const removeElement = (elementName: string) => {
    if (!elements) return;
    const newElement = { ...elements };
    delete newElement[elementName];
    setElements(newElement);
  };

  return (
    <div className="w-full  flex flex-col">
      <label className="grid grid-cols-12 relative w-full z-10">
        <input
          value={JSON.stringify(elements) || "none"}
          name={name}
          className="hidden"
          readOnly
        />
        <input
          className="col-start-1 col-end-3 input-key bg-background border-2 border-[rgb(176,178,186)] rounded-md rounded-e-none h-8 focus-visible:border-accent/90 focus:border-2 outline-none py-4 pl-1"
          type="text"
          ref={keyInput}
        />
        <input
          className="col-start-3 col-end-12  input-value bg-background border-2 border-[rgb(176,178,186)] border-x-0 h-8 focus-visible:border-accent/90 focus:border-2 outline-none py-4 pl-1 "
          type="text"
          ref={valueInput}
        />
        <button
          className="relative border-2 bg-background pb-[.15rem] rounded-s-none rounded-md border-[rgb(176,178,186)] active:border-accent/90 active:text-accent/90"
          onClick={addElement}
          type="button"
        >
          +
        </button>
      </label>

      {elements && Object.keys(elements).length > 0 && (
        <div className="border-2 border-[rgb(176,178,186)] rounded-b-md pt-2 -translate-y-3 z-0 ">
          {Object.keys(elements).map((elementName, i) => (
            <div
              className={`${
                i > 0 ? "border-t-2 border-t-[rgb(176,178,186)]" : ""
              } grid grid-cols-12 relative`}
              key={elementName + i}
            >
              <span className="!border-x-4 !border-x-transparent col-start-1 col-end-12 flex items-center w-auto border-r-0 border-[rgb(176,178,186)] rounded-md rounded-e-none h-8 focus-visible:border-accent/90 focus:border-2 outline-none py-4 pl-1 gap-2">
                <span>{elementName}</span>
                <span>:</span>
                <span className="w-5/12 overflow-hidden text-ellipsis">
                  {elements![elementName]}
                </span>
              </span>
              <button
                className="relative ml-[0.1rem] bg-background pb-[.15rem] rounded-s-none rounded-md border-[rgb(176,178,186)] border-l-2 active:border-accent/90 active:text-accent/90"
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
