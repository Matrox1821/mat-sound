import type { SVGProps } from "react";

export function Play(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="m6.192 3.67l13.568 7.633a.8.8 0 0 1 0 1.394L6.192 20.33A.8.8 0 0 1 5 19.632V4.368a.8.8 0 0 1 1.192-.697"
      ></path>
    </svg>
  );
}
