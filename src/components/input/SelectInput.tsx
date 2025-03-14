import { useEffect, useState } from "react";

interface Element {
  image: string;
  name: string;
  id: string;
  [key: string]: any;
}

export function SelectInput({
  name,
  data,
  zIndex = 30,
  title,
  isRequired,
  isMultiple,
  callback,
  sendImage,
}: {
  name: string;
  data: Element[];
  zIndex?: number;
  title: string;
  isRequired?: boolean;
  isMultiple?: boolean;
  callback?: (value: string[], elements: Element[]) => void;
  sendImage?: boolean;
}) {
  const [elements, setElements] = useState<Element[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const [value, setValue] = useState<string[]>([]);
  useEffect(() => {
    if (callback) callback(value, elements);
  }, [value]);
  const addElement = (item: any) => {
    const existItemInElements = elements.find((e) => e.id === item.id);
    if (!existItemInElements) {
      if (isMultiple) {
        setElements((prev) => [...prev, item]);
        setImages((prev) => [...prev, item.image]);
        setValue((prev) => [...prev, item.id]);
        return;
      }
      setElements([item]);
      setValue([item.id]);
      setImages([item.image]);
    }
  };

  const removeElement = (elementId: string) => {
    const newElements = elements.filter((element) => element.id !== elementId);
    const newElementsIds = newElements.map((element) => element.id);
    setElements(newElements);
    setValue(newElementsIds);
  };

  return (
    <label style={{ zIndex }} className="flex flex-col gap-2 relative">
      <h2
        className={`flex ${
          !data || data.length === 0 ? "text-content/20" : ""
        }`}
      >
        {title}
        {isRequired && <span className="text-red-400 pl-1">*</span>}
      </h2>
      <input
        value={JSON.stringify(value) || "none"}
        name={name}
        className="hidden"
        readOnly
      />
      <div
        tabIndex={0}
        role="button"
        className={`relative ${
          !data || data.length === 0 ? "" : "select-button"
        }`}
      >
        <div
          className={`flex h-20 items-center gap-2 bg-background border-2 rounded-md 
        ${
          !data || data.length === 0
            ? "border-content/20"
            : "active:border-accent/90 active:border-2 border-content/70  active:bg-accent/40 selected-item"
        } p-1 z-20 relative`}
        >
          {!data || data.length === 0 || elements.length === 0 ? (
            <h2
              className={`h-10 flex items-center pl-1 ${
                !data || data.length === 0 ? "text-content/20" : ""
              }`}
            >
              {!data || data.length === 0
                ? "No existen elementos para agregar"
                : "Sin elementos"}
            </h2>
          ) : (
            elements.map((element) => (
              <div
                className="flex p-2 border-accent border-1 rounded-xs gap-2"
                key={element.id}
              >
                <img
                  src={element.image}
                  alt={element.name}
                  className="w-12 h-12 radius-sm object-cover"
                />
                <h2 className="h-12 flex items-center pl-1 text-sm">
                  {element.name}
                </h2>
                <button
                  type="button"
                  className="flex items-end text-2xl h-4 gap-1 text-content/60 hover:text-accent/100 cursor-pointer"
                  onClick={() => {
                    removeElement(element.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        <ul
          className={`bg-background flex flex-col pt-6 absolute -translate-y-10 border-t-0 rounded-t-none border-2 w-full z-10 rounded-md select-options gap-2
          ${!data || data.length === 0 ? "!border-0" : ""}`}
        >
          {data ? (
            data.map((item: any, i: any) => (
              <li key={item.id} className="w-full ">
                <button
                  type="button"
                  style={{
                    backgroundColor: elements.find((e) => e.id === item.id)
                      ? "rgba(var(--accent),0.2)"
                      : "rgba(var(--bg))",
                  }}
                  className="w-full bg-background p-1 active:bg-accent/40 z-20 relative flex h-full items-center gap-2 cursor-pointer"
                  onClick={() => {
                    addElement(item);
                  }}
                >
                  {item.image !== "none" && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 radius-sm object-cover"
                    />
                  )}
                  <div>
                    {item?.artist && item.image !== "none" ? (
                      <h2>
                        {item?.name} de <span>{item.artist?.name}</span>
                      </h2>
                    ) : (
                      <h2 className="h-10 flex items-center pl-1">
                        {item?.name}
                      </h2>
                    )}
                  </div>
                </button>
              </li>
            ))
          ) : (
            <option>No existen elementos</option>
          )}
        </ul>
        {images.length > 0 && sendImage && elements.length > 0 && (
          <input
            className="hidden"
            readOnly
            value={images[images.length - 1]}
            name="album_image"
          />
        )}
      </div>
    </label>
  );
}
