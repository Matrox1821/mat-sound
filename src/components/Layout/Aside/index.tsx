"use client";
import { useDevice } from "@/hooks/ui/useDevice";
import { Size } from "@/types";
import { usePathname } from "next/navigation";
export default function Aside() {
  const { isMobile } = useDevice();
  const pathname = usePathname();
  const isAdminPage = pathname.split("/").includes("admin");
  /* if (device === Size.Mobile || isAdminPage) return null; */
  return (
    <aside className="w-68 h-full hidden md:!flex">
      <div className="bg-background-900 w-full h-full flex justify-center items-center">aside</div>
    </aside>
  );
}
