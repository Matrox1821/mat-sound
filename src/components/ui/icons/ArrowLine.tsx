import type { SVGProps } from "react";

interface ArrowProps extends SVGProps<SVGSVGElement> {
  to: "up" | "bottom" | "left" | "right";
}

const position = (to: "up" | "bottom" | "left" | "right") => {
  switch (to) {
    case "up":
      return "rotate-180";
    case "left":
      return "rotate-90";
    case "right":
      return "-rotate-90";
    default:
      return "rotate-0";
  }
};

export function ArrowLine({ to, className, ...props }: ArrowProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      {...props}
      className={`${className} ${position(to)}`}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.53 14.78a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V4.75a.75.75 0 0 1 1.5 0v7.69l1.22-1.22a.75.75 0 1 1 1.06 1.06zM14.25 2.5a.75.75 0 0 0 0-1.5H1.75a.75.75 0 0 0 0 1.5z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
