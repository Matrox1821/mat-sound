"use client";
import { Button } from "primereact/button";
import { Dialog as PrimeReactDialog } from "primereact/dialog";
import { ReactNode, useState } from "react";

export function BulkDialog({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button
        label="Creación masiva"
        icon="pi pi-plus"
        className="!bg-background-800 !border-none !text-white"
        onClick={() => setVisible(true)}
      />
      <PrimeReactDialog
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
      ></PrimeReactDialog>
    </div>
  );
}
