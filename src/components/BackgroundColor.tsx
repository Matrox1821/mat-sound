import { RgbColor } from "../shared/helpers";
import { useCallback, useEffect, useState } from "react";

interface BackgroundColorProps {
  image: string;
}

export function BackgroundColor({ image }: BackgroundColorProps) {
  /* const [color, setColor] = useState<string>();
   */
  const color = useCallback(() => RgbColor(image), []);
  /* useEffect(() => {
    hendleColor();
  }, [colorData]);

  function hendleColor() {
    setColor(colorData.color);
  } */

  return (
    <div
      style={{
        background: `linear-gradient(to bottom,rgba(${
          color().color
        },0.7) 10%,#040b17 )`,
        top: "0",
        height: "50vh",
      }}
      className="absolute z-0 w-screen left-0"
    />
  );
}
