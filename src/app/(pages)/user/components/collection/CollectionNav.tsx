"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CollectionNav({ username }: { username?: string | null }) {
  const pathname = usePathname();
  const links = [
    { label: "Mejores Resultados", href: "all" },
    { label: "Playlists", href: "playlists" },
    { label: "Canciones", href: "tracks" },
    { label: "Álbumes", href: "albums" },
  ];
  return (
    <nav className="flex items-center h-12 gap-5">
      {links.map((link, i) => (
        <Link
          className={`hover:bg-background-700 rounded-md py-2 px-8 ${
            (pathname.endsWith("collection") && link.href === "all") || pathname.includes(link.href)
              ? "bg-background-800"
              : ``
          }`}
          key={i}
          href={`${link.href === "all" ? `/user/${username}/collection` : `/user/${username}/collection/${link.href}`}`}
        >
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}
