"use client";
import { ArrowLine } from "@components/ui/icons/ArrowLine";
import { AdminNavigation, UserNavigation } from "./AsideContent";
import Link from "next/link";
import { MatSound } from "@components/ui/icons/MatSound";
import { useDevice } from "@/shared/client/hooks/ui/useDevice";
import { usePathname } from "next/navigation";
import { useAsideStore } from "@/store/asideStore";
import { UserCollection } from "./UserCollection";
import { authClient } from "@/lib/auth-client";

export function Aside({ userCollectionPromise }: { userCollectionPromise: Promise<any> }) {
  const { isMobile } = useDevice();
  const pathname = usePathname();
  const { isExpanded, setIsExpanded } = useAsideStore();
  const session = authClient.useSession();
  const isAdminPage = pathname.split("/").includes("admin");
  const isAuthPage = ["signin", "signup"].some((p) => pathname.includes(p));

  if (isMobile || isAuthPage) return null;

  return (
    <aside
      className={`h-full hidden md:!flex relative bg-background border-r-[1px] border-background-800/60 transition-all duration-200 ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      <div
        className={`h-full flex flex-col p-4 transition-all duration-200 ${
          isExpanded ? "w-72" : "w-20"
        }`}
      >
        <header className="flex items-center mb-8 h-12">
          <div className="relative w-full h-full flex items-center justify-between">
            <div
              className={`relative h-full group flex items-center  ${isExpanded ? "" : "w-full"}`}
            >
              <Link
                href="/"
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
              >
                <ArrowLine to="right" />
              </button>
            </div>

            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="w-12 h-12 p-2 rounded-md hover:bg-background-800/60 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
              >
                <ArrowLine to="left" />
              </button>
            )}
          </div>
        </header>

        <nav className="flex-1">
          {isAdminPage ? (
            <AdminNavigation isExpanded={isExpanded} pathname={pathname} />
          ) : (
            <UserNavigation
              isExpanded={isExpanded}
              pathname={pathname}
              username={session.data?.user.username}
            />
          )}
          {/* <Suspense fallback={<CollectionSkeleton isExpanded={isExpanded} />}> */}
          <UserCollection isExpanded={isExpanded} promise={userCollectionPromise} />
          {/* </Suspense> */}
        </nav>
      </div>
    </aside>
  );
}
