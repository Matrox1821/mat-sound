import { useState } from "react";
interface Items {
  id: string;
  name: string;
  image: string;
  artist?: { name: string } | null;
}

interface CustomSelectProps {
  items: Items[];
  name: string;
  zIndex?: number;
}
export function CustomSelect({ items, name, zIndex }: CustomSelectProps) {
  const [selectedItem, setSelectedItem] = useState<Items | null>(
    name === "artist_id" ? items[0] : null
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);
  return (
    <label
      style={{ zIndex: zIndex || 30 }}
      className="flex flex-col gap-2 relative"
    >
      {name === "album_id" ? (
        "Seleccione el album:"
      ) : (
        <h2 className="flex">
          Seleccione el artista:<span className="text-red-400 pl-1">*</span>
        </h2>
      )}
      <input
        value={selectedItem?.id || "none"}
        name={name}
        className="hidden"
        readOnly
      />
      <div
        tabIndex={0}
        role="button"
        onClick={handleClick}
        className={`relative select-button-${name}`}
      >
        <div className="flex h-full items-center gap-2 bg-[rgba(var(--bg))] border-2 border-[rgba(var(--content),.7)] rounded-md active:border-[rgba(var(--accent),.9)] active:border-2 p-1 active:bg-[rgba(var(--accent),0.4)] z-20 relative selected-item">
          {selectedItem && selectedItem.image !== "none" && (
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-10 h-10 radius-sm object-cover"
            />
          )}
          {selectedItem ? (
            selectedItem.artist && selectedItem.image !== "none" ? (
              <h2>
                {selectedItem.name} de <span>{selectedItem.artist?.name}</span>
              </h2>
            ) : (
              <h2 className="h-10 flex items-center pl-1">
                {selectedItem.name}
              </h2>
            )
          ) : (
            <h2 className="h-10 flex items-center pl-1">Sin album</h2>
          )}
        </div>
        <ul className="bg-[rgba(var(--bg))] flex flex-col pt-6 absolute -translate-y-10 border-t-0 rounded-t-none border-2 w-full z-10 rounded-md select-options gap-2">
          {items ? (
            items.map((item: any) => (
              <li key={item.id} className="w-full">
                <button
                  type="button"
                  style={{
                    backgroundColor:
                      selectedItem?.id && selectedItem?.id === item.id
                        ? "rgba(var(--accent),0.2)"
                        : "rgba(var(--bg))",
                  }}
                  className="w-full bg-[rgba(var(--bg))] p-1 active:bg-[rgba(var(--accent),0.4)] z-20 relative flex h-full items-center gap-2"
                  onClick={() => {
                    setSelectedItem(item);
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
            <option>No existen albums</option>
          )}
        </ul>
      </div>
    </label>
  );
}
