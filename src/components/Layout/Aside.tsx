"use client";
import { useDevice } from "@/shared/client/hooks/ui/useDevice";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Aside() {
  const { isMobile } = useDevice();
  const pathname = usePathname();
  const isAdminPage = pathname.split("/").includes("admin");
  if (isMobile) return null;

  const adminLinks = [
    { label: "Track", href: "/admin/track?page=1" },
    { label: "Album", href: "/admin/album?page=1" },
    { label: "Artist", href: "/admin/artist?page=1" },
    { label: "Genres", href: "/admin/genres?page=1" },
  ];

  if (isAdminPage)
    return (
      <aside className="w-68 h-full hidden md:!flex relative">
        <nav className="bg-background-900 w-full h-full p-8">
          <ul className="flex flex-col gap-4">
            {adminLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`font-semibold text-xl ${
                    pathname.split("/").includes(link.label.toLocaleLowerCase())
                      ? "text-accent-600"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    );
  return (
    <aside className="w-68 h-full hidden md:!flex relative">
      <div className="bg-background-900 w-full h-full flex justify-center items-center">aside</div>
    </aside>
  );
}
