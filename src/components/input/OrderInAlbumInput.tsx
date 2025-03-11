import { ChangeEvent, useEffect, useState } from "react";

interface Element {
  image?: string;
  name?: string;
  id?: string;
  [key: string]: any;
}

export function OrderAlbumInput({
  name,
  data,
  zIndex = 30,
  title,
  isMultiple,
}: {
  name: string;
  data: Element[];
  zIndex?: number;
  title: string;
  isRequired?: boolean;
  isMultiple?: boolean;
  callback?: (value: string[]) => void;
}) {
  const [value, setValue] = useState<{ [key: string]: string }[]>([]);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  const handleMenu = () => setMenuIsOpen(!menuIsOpen);
  console.log(value);
  return (
    <label style={{ zIndex }} className="flex flex-col gap-2 relative">
      <h2
        className={`flex ${
          !data || data.length === 0 ? "text-content/20" : ""
        }`}
      >
        {title}
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
        onClick={handleMenu}
        className={`relative`}
      >
        <div
          className={`flex h-20 items-center gap-2 bg-background border-2 rounded-md 
        ${
          !data || data.length === 0
            ? "border-content/20"
            : "active:border-accent/90 active:border-2 border-content/70  active:bg-accent/40 selected-item"
        } p-1 z-20 relative`}
        >
          {
            <h2
              className={`h-10 flex items-center pl-1 ${
                !data || data.length === 0 ? "text-content/20" : ""
              }`}
            >
              {!data || data.length === 0
                ? "No existen elementos para editar"
                : "Edite cada elemento elegido"}
            </h2>
          }
        </div>
        <ul
          className={`bg-background flex flex-col pt-6 absolute -translate-y-5 border-t-0 rounded-t-none border-2 w-full z-10 rounded-md select-options gap-2 
          ${!data || data.length === 0 ? "!border-0" : ""} ${
            menuIsOpen ? "" : "hidden"
          }`}
          onClick={(e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {data ? (
            data.map((item: any) => (
              <li
                key={item.id}
                className="w-full flex items-center justify-between pr-4 bg-accent/5"
              >
                <div className="w-full p-1 z-20 relative flex h-full items-center gap-2">
                  {item.image !== "none" && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 radius-sm object-cover"
                    />
                  )}
                  <span>
                    {item?.artist && item.image !== "none" ? (
                      <span>
                        {item?.name} de <span>{item.artist?.name}</span>
                      </span>
                    ) : (
                      <span className="h-10 flex items-center pl-1">
                        {item?.name}
                      </span>
                    )}
                  </span>
                </div>
                <div className=" p-1  z-20 relative flex h-full items-center gap-2">
                  <input
                    type="number"
                    name="order_number"
                    defaultValue={0}
                    className="bg-accent h-8 border-2 rounded-sm text-background font-bold text-base w-24 ocus-visible:border-accent/90 focus:border-2 outline-none p-2"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setValue([...value, { [item.id]: e.target.value }]);
                    }}
                  />
                </div>
              </li>
            ))
          ) : (
            <option>No existen elementos</option>
          )}

          <li className="w-full h-12 flex items-center justify-center pr-4 bg-accent/5">
            <button
              className="h-8 w-28 p-1 z-20 relative flex items-center gap-2 cursor-pointer bg-accent text-base text-background font-bold justify-center rounded-xs"
              type="button"
              onClick={() => {
                const newValues = [...value];
                const reducedValues = newValues.reduce(
                  (acc: { [key: string]: { [key: string]: string } }, item) => {
                    const key = Object.keys(item)[0];
                    acc[key] = item;
                    return acc;
                  },
                  {}
                );
                const result = Object.values(reducedValues);
                setValue(result);
                setMenuIsOpen(false);
              }}
            >
              Completar
            </button>
          </li>
        </ul>
      </div>
    </label>
  );
}
