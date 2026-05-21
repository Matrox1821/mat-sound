import Link from "next/link";

interface AsideLinkProps {
  href: string;
  label: string;
  isExpanded: boolean;
  isActive: boolean;
  visual?: React.ReactNode;
}

export const AsideLink = ({ href, label, isExpanded, isActive, visual }: AsideLinkProps) => (
  <li>
    <Link
      href={href}
      className={`flex items-center h-12 gap-3 p-2 rounded-lg group relative
        transition-colors hover:[&>.play-button]:opacity-100! hover:[&>.play-button]:!transition-all hover:[&>.play-button]:!duration-300 
        not-hover:[&>.play-button]:!transition-all not-hover:[&>.play-button]:!duration-300 ${
          isActive
            ? "bg-accent-600/20 text-accent-800"
            : "text-content-800 hover:bg-background-800/60 hover:text-content-100"
        }`}
    >
      <div className="h-full aspect-square flex-shrink-0 flex items-center justify-center overflow-hidden leading-0">
        {visual}
      </div>

      <span
        className={`font-semibold text-base whitespace-nowrap transition-all duration-100 ${
          isExpanded ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0 overflow-hidden"
        }`}
      >
        {label}
      </span>
    </Link>
  </li>
);
