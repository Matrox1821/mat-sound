"use client";
import { useDevice } from "@/hooks/useDevice";
import { Size } from "@/types";
import { usePathname } from "next/navigation";
export default function Aside() {
  const { device } = useDevice();
  const pathname = usePathname();
  const isAdminPage = pathname.split("/").includes("admin");
  if (device === Size.Mobile || isAdminPage) return null;
  return (
    <aside className="col-start-1 col-end-4 row-start-1 row-end-12 justify-center items-center w-full h-full bg-green-500">
      aside
    </aside>
  );
}
