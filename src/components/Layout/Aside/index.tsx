"use client";
import { MatSound } from "@/components/ui/icons/MatSound";
import { useDevice } from "@/shared/client/hooks/ui/useDevice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAsideStore } from "@/store/asideStore";
import { ArrowLine } from "@/components/ui/icons/ArrowLine";
import { Clover } from "./Clover";

export default function Aside() {
  const { isMobile } = useDevice();
  const pathname = usePathname();
  const isAdminPage = pathname.split("/").includes("admin");
  const isAuthPage =
    pathname.split("/").includes("signin") || pathname.split("/").includes("signup");

  const { isExpanded, setIsExpanded } = useAsideStore();

  if (isMobile || isAuthPage) return null;

  const adminLinks = [
    { label: "Track", href: "/admin/track?page=1", icon: "pi pi-headphones" },
    { label: "Album", href: "/admin/album?page=1", icon: "pi pi-folder" },
    { label: "Artist", href: "/admin/artist?page=1", icon: "pi pi-user" },
    { label: "Genres", href: "/admin/genres?page=1", icon: "pi pi-tags" },
  ];

  const userLinks = [
    { label: "Home", href: "/", icon: "pi pi-home" },
    { label: "Favoritos", href: "/user/favorites", icon: "pi pi-heart" },
    { label: "Colección", href: "/user/collection", icon: "pi pi-book" },
  ];

  return (
    <aside
      className={`h-full hidden md:!flex relative bg-background border-r-[1px] border-background-800/60 transition-all duration-200 ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      <div className={`h-full flex flex-col p-4 ${isExpanded ? "w-72" : "w-20"}`}>
        <div className={`h-full flex flex-col`}>
          <header className="flex items-center mb-8 h-12">
            <div className="relative w-full h-full flex items-center justify-between">
              <div
                className={`relative h-full group flex items-center justify-center ${
                  isExpanded ? "" : "w-full"
                }`}
              >
                <Link
                  href={"/"}
                  className={`flex items-center justify-center transition-all duration-200 w-12 h-12 ${
                    !isExpanded ? "pointer-events-none group-hover:pointer-events-auto" : ""
                  }`}
                >
                  <MatSound
                    className={`w-10 h-10 transition-opacity duration-200 ${
                      isExpanded ? "opacity-100" : "opacity-100 group-hover:opacity-0"
                    }`}
                  />
                </Link>
                <button
                  onClick={() => setIsExpanded(true)}
                  className={`absolute left-0 top-0 w-12 h-12 p-2 rounded-md hover:bg-background-800/60 flex items-center justify-center transition-opacity duration-200 cursor-pointer ${
                    isExpanded
                      ? "opacity-0 invisible pointer-events-none"
                      : "opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none group-hover:pointer-events-auto"
                  }`}
                  aria-label="Expandir sidebar"
                >
                  <ArrowLine to="right" />
                </button>
              </div>
              {isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-12 h-12 p-2 rounded-md hover:bg-background-800/60 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
                  aria-label="Minimizar sidebar"
                >
                  <ArrowLine to="left" />
                </button>
              )}
            </div>
          </header>

          <nav className="flex-1">
            <ul className="flex flex-col gap-2">
              {isAdminPage
                ? adminLinks.map((link) => {
                    const isActive = pathname.split("/").includes(link.label.toLocaleLowerCase());
                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className={`flex items-center h-12 gap-3 pl-4 rounded-lg transition-colors ${
                            isActive
                              ? "bg-accent-600/20 text-accent-800"
                              : "text-content-800 hover:bg-background-800/60 hover:text-accent-500"
                          }`}
                        >
                          <i className={`${link.icon} text-xl flex-shrink-0`} />
                          <span
                            className={`font-semibold text-base whitespace-nowrap transition-all duration-100 ${
                              isExpanded
                                ? "max-w-[200px] opacity-100"
                                : "max-w-0 opacity-0 overflow-hidden"
                            }`}
                          >
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })
                : userLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className={`flex items-center h-12 gap-3 pl-4 rounded-lg transition-colors ${
                            isActive
                              ? "bg-accent-600/20 text-accent-800"
                              : "text-content-800 hover:bg-background-800/60 hover:text-content-100"
                          }`}
                        >
                          <i className={`${link.icon} text-xl flex-shrink-0`} />
                          <span
                            className={`font-semibold text-base whitespace-nowrap transition-all duration-100 ${
                              isExpanded
                                ? "max-w-[200px] opacity-100"
                                : "max-w-0 opacity-0 overflow-hidden"
                            }`}
                          >
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
            </ul>
          </nav>
        </div>
        <div className="relative h-16">
          <Clover className="h-20 w-20 px-6 text-content-900/85 absolute -left-20 hover:translate-x-14" />
        </div>
      </div>
    </aside>
  );
}
