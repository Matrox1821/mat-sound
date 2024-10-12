import { usePalette } from "react-palette";
import type { RgbProps } from "./types";

export function hexToRgb(hex?: string) {
  if (!hex) return { r: 0, g: 0, b: 0 } as RgbProps;
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 } as RgbProps;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } as RgbProps;
}

export function RgbColor(image?: string | null) {
  if (!image) return { color: `0,0,0`, accentColor: `0,0,0` };

  const { data } = usePalette(image + "?solve-cors-error");

  const color = hexToRgb(data.lightMuted);

  const accentColor = hexToRgb(data.darkMuted);

  return {
    color: `${color.r},${color.g},${color.b}`,
    accentColor: `${accentColor.r},${accentColor.g},${accentColor.b}`,
  };
}
