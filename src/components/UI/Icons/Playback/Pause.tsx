import type { SVGProps } from "react";

export function Pause(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M4.8 3h4.4a.8.8 0 0 1 .8.8v16.4a.8.8 0 0 1-.8.8H4.8a.8.8 0 0 1-.8-.8V3.8a.8.8 0 0 1 .8-.8m10 0h4.4a.8.8 0 0 1 .8.8v16.4a.8.8 0 0 1-.8.8h-4.4a.8.8 0 0 1-.8-.8V3.8a.8.8 0 0 1 .8-.8"
      ></path>
    </svg>
  );
}
