"use client";
import { useDevice } from "@/shared/client/hooks/ui/useDevice";
import { useNavigation } from "@/shared/client/hooks/useNavigation";
import { useNavigationStore } from "@/store/navigationStore";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef, useCallback, useEffect } from "react";
import Search from "./Search";
export default function Header() {
  const pathname = usePathname();
  const push = useNavigationStore((s) => s.push);

  useEffect(() => {
    if (pathname) push(pathname);
  }, [pathname]);

  const { back, canGoBack, canGoForward, forward } = useNavigation();
  const { isMobile } = useDevice();
  const isAdminPage = pathname.split("/").includes("admin");
  if (isMobile) return null;

  const adminLinks = [
    { label: "Track", href: "/admin/track?page=1" },
    { label: "Album", href: "/admin/album?page=1" },
    { label: "Artist", href: "/admin/artist?page=1" },
    { label: "Genres", href: "/admin/genres?page=1" },
  ];

  if (isAdminPage) return <header></header>;
  return (
    <header className="fixed top-0 right-0 w-[calc(100vw-238px)] h-18 flex items-center justify-between z-30 p-4 pr-8 pl-7">
      <div className="flex gap-2">
        <button
          className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md bg-background-800/80 border-[1px] border-background-800 ${
            canGoBack ? "" : "opacity-60 !cursor-default"
          }`}
          onClick={back}
        >
          <i className="pi pi-angle-left" />
        </button>
        <button
          className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md bg-background-800/80 border-[1px] border-background-800  ${
            canGoForward ? "" : "opacity-60 !cursor-default"
          }`}
          onClick={forward}
        >
          <i className="pi pi-angle-right" />
        </button>
      </div>
      <Search />
    </header>
  );
}
