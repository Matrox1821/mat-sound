"use client";
import { Dialog } from "primereact/dialog";
import { ReactNode, useState } from "react";

export function EditProfile({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <button
        className="!border-none !text-white cursor-pointer flex flex-col items-center gap-2"
        onClick={() => setVisible(true)}
      >
        <i className="pi pi-pencil !text-xl"></i>
        Editar
      </button>
      <Dialog
        className="!border-0"
        visible={visible}
        modal
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        content={() => (
          <div
            className="flex flex-col p-3 bg-background-950 items-end"
            style={{
              borderRadius: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="text-primary-50 bg-background rounded-full p-1 h-8 w-8 flex items-center justify-center cursor-pointer hover:bg-background-800/60"
            >
              <i className="pi pi-times"></i>
            </button>
            {children}
          </div>
        )}
      ></Dialog>
    </div>
  );
}
