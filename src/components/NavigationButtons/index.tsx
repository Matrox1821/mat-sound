"use client";
import { useRouter } from "next/navigation";
export default function NavigationButtons() {
  const router = useRouter();

  return (
    <div>
      <button type="button" onClick={router.back} className="cursor-pointer">
        <Arrow className="fill-white w-8 h-8" />
      </button>
      <button type="button" onClick={router.forward}>
        <Arrow />
      </button>
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className || "fill-accent w-8 h-8"}
      width="1024"
      height="1024"
      viewBox="0 0 1024 1024"
    >
      <path d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496" />
    </svg>
  );
}
