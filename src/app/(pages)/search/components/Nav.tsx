"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Nav() {
  const params = useSearchParams();
  const pathname = usePathname();
  const buttons = [
    { label: "Mejores Resultados", href: "all" },
    { label: "Artistas", href: "artists" },
    { label: "Canciones", href: "tracks" },
    { label: "Álbumes", href: "albums" },
  ];
  return (
    <nav className="flex items-center h-12 gap-5">
      {buttons.map((button, i) => (
        <Link
          className={`hover:bg-background-700 rounded-md py-2 px-8 ${
            (pathname.endsWith("search") && button.href === "all") || pathname.includes(button.href)
              ? "bg-background-800"
              : `/search/${button.href}`
          }`}
          key={i}
          href={`${button.href === "all" ? "/search" : `/search/${button.href}`}?${params}`}
        >
          <span>{button.label}</span>
        </Link>
      ))}
    </nav>
  );
}
