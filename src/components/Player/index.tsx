"use client";
import { useDevice } from "@/hooks/useDevice";
import { Size } from "@/types";
import { usePathname } from "next/navigation";
export default function Player() {
  const { device } = useDevice();
  const pathname = usePathname();
  const isAdminPage = pathname.split("/").includes("admin");

  if (isAdminPage) return null;

  if (device === Size.Mobile) {
    return (
      <footer className="flex flex-col justify-end h-40 player-mobile-bg fixed bottom-0 w-full p-2">
        <div className="bottom-20 flex bg-accent rounded-md w-full h-14">
          player
        </div>
        <nav className="bottom-0 flex h-14 w-full justify-center items-center">
          Navbar
        </nav>
      </footer>
    );
  }

  return (
    <footer className="col-start-1 col-end-13 row-start-12 row-end-13 justify-center items-center w-full h-full bg-accent">
      player
    </footer>
  );
}
