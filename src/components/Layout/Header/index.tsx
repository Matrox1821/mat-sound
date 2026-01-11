"use client";
import { useDevice } from "@/shared/client/hooks/ui/useDevice";
import { useNavigation } from "@/shared/client/hooks/useNavigation";
import { useNavigationStore } from "@/store/navigationStore";
import { useAsideStore } from "@/store/asideStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Search from "./Search";
import Link from "next/link";
import { MatSound } from "@/components/UI/Icons/MatSound";
import { authClient } from "@/lib/auth-client";
import User from "./User";
export default function Header({ initialSession }: { initialSession: any }) {
  const pathname = usePathname();
  const push = useNavigationStore((s) => s.push);
  const { isExpanded } = useAsideStore();
  const { data: session } = authClient.useSession();
  const currentSession = session || initialSession;
  useEffect(() => {
    if (pathname) push(pathname);
  }, [pathname, push]);

  const { back, canGoBack, canGoForward, forward } = useNavigation();
  const { isMobile } = useDevice();
  const isAdminPage = pathname.split("/").includes("admin");
  const isAuthPage =
    pathname.split("/").includes("signin") || pathname.split("/").includes("signup");

  if (isMobile || isAdminPage) return null;

  if (isAuthPage)
    return (
      <header className="flex h-18 items-center absolute z-10">
        <Link
          href={"/"}
          className={`flex items-center justify-center transition-all duration-200 w-12 h-12 ml-3 ${
            !isExpanded ? "pointer-events-none group-hover:pointer-events-auto" : ""
          }`}
        >
          <MatSound
            className={`w-10 h-10 transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-100 group-hover:opacity-0"
            }`}
          />
        </Link>
      </header>
    );

  const asideWidth = isExpanded ? 288 : 80;
  const spacing = 28;
  const headerLeft = asideWidth + spacing;
  const headerWidth = `calc(100vw - ${asideWidth}px - ${spacing}px)`;

  return (
    <header
      className="fixed top-0 h-18 flex items-center justify-between z-30 py-10 pr-8 transition-all duration-200"
      style={{
        left: `${headerLeft}px`,
        width: headerWidth,
      }}
    >
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
      <div className="flex gap-4 items-center">
        <Search />
        {currentSession ? (
          <User initialSession={initialSession} />
        ) : (
          <>
            <Link
              href={"/signup"}
              className="!h-10 !px-6 !rounded-full !bg-transparent !border-[1px] !border-background-700/70 hover:!bg-background-800/50 !text-background-50 !font-semibold flex items-center transition-colors duration-100"
            >
              Registrarse
            </Link>
            <Link
              href={"/signin"}
              className="flex items-center !h-10 !px-6 !rounded-full bg-content-900/80 hover:!bg-accent-700 hover:brightness-90 !text-background-900 !font-semibold transition-colors duration-100"
            >
              Iniciar sesión
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
