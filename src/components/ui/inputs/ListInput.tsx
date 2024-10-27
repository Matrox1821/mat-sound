import { useEffect, useState } from "react";

export function ListInput({
  name,
  areImages,
}: {
  name: string;
  areImages?: boolean;
}) {
  const [element, setElement] = useState<string>("");

  const [elements, setElements] = useState<string[]>([]);

  useEffect(() => {
    const $element = document.querySelector(".input-list");

    if (!$element) return;
    $element.addEventListener("input", (e: any) => {
      setElement(e?.target?.value || "");
    });
    return () => {
      $element.removeEventListener("input", (e: any) => {
        setElement(e?.target?.value || "");
      });
    };
  }, []);

  const addElement = () => {
    const newElements = elements;
    setElements([element, ...newElements]);
  };
  const removeCover = (elementData: string) => {
    const newElements = elements.filter(
      (newElement) => newElement !== elementData
    );

    setElements(newElements);
  };

  return (
    <div className="w-full relative flex flex-col">
      <label className="flex relative w-full z-10">
        <input
          value={JSON.stringify(elements) || "none"}
          name={name}
          className="hidden"
          readOnly
        />
        <input
          className="input-list w-full bg-[rgba(var(--bg))] border-2 border-[rgb(176,178,186)] rounded-md rounded-e-none h-8 focus-visible:border-[rgba(var(--accent),.9)] focus:border-2 outline-none py-4 pl-1"
          type="text"
        />
        <button
          className="relative w-2/12 border-2 border-l-0 bg-[rgba(var(--bg))] pb-[.15rem] rounded-s-none rounded-md border-[rgb(176,178,186)] active:border-[rgba(var(--accent),.9)] active:text-[rgba(var(--accent),.9)]"
          onClick={addElement}
          type="button"
        >
          +
        </button>
      </label>

      {elements.length > 0 && (
        <div className="border-2 border-[rgb(176,178,186)] rounded-b-md pt-2 -translate-y-3 z-0 table-input w-full flex flex-col">
          {elements.map((elementData, i) => (
            <div
              className={
                elements.length === 1 || elements.length === i + 1
                  ? "flex relative w-full"
                  : "flex relative w-full border-b-2 border-[rgb(176,178,186)]"
              }
              key={elementData + i}
            >
              <span className="flex items-center border-r-0 border-[rgb(176,178,186)] rounded-md rounded-e-none  h-8 focus-visible:border-[rgba(var(--accent),.9)] focus:border-2 outline-none pl-1 overflow-hidden text-ellipsis w-full">
                {areImages && (
                  <img
                    src={elementData}
                    alt="nuevo cover"
                    className="h-6 w-6 rounded-sm object-cover"
                  />
                )}
                <figcaption className="overflow-hidden text-ellipsis w-full ml-1 text-xs text-nowrap">
                  {elementData}
                </figcaption>
              </span>
              <button
                className="relative z-0 w-2/12 pb-[.15rem] active:text-[rgba(var(--accent),.9)] border-l-2 border-[rgb(176,178,186)] ml-2"
                onClick={() => removeCover(elementData)}
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
