"use client";
import { useDevice } from "@/hooks/useDevice";
import { Size } from "@/types";

export default function Home() {
  const { device } = useDevice();
  return (
    <main
      className={`${
        device === Size.Desktop
          ? "col-start-4 col-end-13 row-start-1 row-end-12 justify-center items-center overflow-auto"
          : "flex flex-col items-center justify-center h-full"
      } w-full p-2 bg-red-500`}
    >
      <div className="h-60">Mondongo</div>
      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>
      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>
      <div className="h-60">Mondongo</div>
      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div className="h-60">Mondongo</div>

      <div>Mondongo</div>

      <div>Mondongo</div>

      <div>Mondongo</div>
      <div>Mondongo</div>
    </main>
  );
}
