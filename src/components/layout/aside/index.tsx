"use client";
import { ArrowLine } from "@components/ui/icons/ArrowLine";
import { AdminNavigation, UserNavigation } from "./AsideContent";
import Link from "next/link";
import { MatSound } from "@components/ui/icons/MatSound";
import { useDevice } from "@/shared/client/hooks/ui/useDevice";
import { usePathname } from "next/navigation";
import { UserCollection } from "./UserCollection";
import { useAppUIStore } from "@/store/appUIStore";

export function Aside({
  userCollectionPromise,
  username,
}: {
  userCollectionPromise: Promise<any>;
  username?: string | null;
}) {
  const { isMobile } = useDevice();
  const pathname = usePathname();
  const { asideIsExpanded, setAsideIsExpanded } = useAppUIStore();
  const isAdminPage = pathname.split("/").includes("admin");
  const isAuthPage = ["signin", "signup"].some((p) => pathname.includes(p));

  if (isMobile || isAuthPage) return null;

  return (
    <aside
      className={`h-full hidden md:!flex relative bg-background border-r-[1px] border-background-800/60 transition-all duration-200 ${
        asideIsExpanded ? "w-72" : "w-20"
      }`}
    >
      <div
        className={`h-full flex flex-col p-4 transition-all duration-200 ${
          asideIsExpanded ? "w-72" : "w-20"
        }`}
      >
        <header className="flex items-center mb-8 h-12">
          <div className="relative w-full h-full flex items-center justify-between">
            <div
              className={`relative h-full group flex items-center  ${asideIsExpanded ? "" : "w-full"}`}
            >
              <Link
                href="/"
                className={`flex items-center justify-center transition-all duration-200 w-12 h-12 ${
                  !asideIsExpanded ? "pointer-events-none group-hover:pointer-events-auto" : ""
                }`}
              >
                <MatSound
                  className={`w-10 h-10 transition-opacity duration-200 ${
                    asideIsExpanded ? "opacity-100" : "opacity-100 group-hover:opacity-0"
                  }`}
                />
              </Link>

              <button
                onClick={() => setAsideIsExpanded(true)}
                className={`absolute left-0 top-0 w-12 h-12 p-2 rounded-md hover:bg-background-800/60 flex items-center justify-center transition-opacity duration-200 cursor-pointer ${
                  asideIsExpanded
                    ? "opacity-0 invisible pointer-events-none"
                    : "opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none group-hover:pointer-events-auto"
                }`}
              >
                <ArrowLine to="right" />
              </button>
            </div>

            {asideIsExpanded && (
              <button
                onClick={() => setAsideIsExpanded(false)}
                className="w-12 h-12 p-2 rounded-md hover:bg-background-800/60 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
              >
                <ArrowLine to="left" />
              </button>
            )}
          </div>
        </header>

        <nav className="flex-1">
          {isAdminPage ? (
            <AdminNavigation isExpanded={asideIsExpanded} pathname={pathname} />
          ) : (
            <UserNavigation isExpanded={asideIsExpanded} pathname={pathname} username={username} />
          )}
          {/* <Suspense fallback={<CollectionSkeleton isExpanded={isExpanded} />}> */}
          <UserCollection isExpanded={asideIsExpanded} promise={userCollectionPromise} />
          {/* </Suspense> */}
        </nav>
      </div>
    </aside>
  );
}
