import { rgbColor } from "../../shared/helpers";
import { useCallback } from "react";

interface BackgroundColorProps {
  image: string;
  styles?: string;
  from?: string;
  to?: string;
}

export function BackgroundColor({
  image,
  styles,
  from,
  to,
}: BackgroundColorProps) {
  const color = useCallback(() => rgbColor(image), []);

  const bgStyles = `absolute z-0 w-screen left-0 ${styles || ""}`;

  return (
    <div
      style={{
        background: `linear-gradient(to bottom,rgba(${color().color},0.7) ${
          from || "10%"
        },rgb(var(--bg)) ${to || "100%"})`,
        top: "0",
        height: "50vh",
      }}
      className={bgStyles}
    />
  );
}
