import { MAX_SIZE_MOBILE } from "@/shared/constants";
import { Size } from "@/types";
import { useEffect, useState } from "react";

export const useDevice = () => {
  const [device, setDevice] = useState<Size>(Size.Mobile);

  useEffect(() => {
    const viewportSize = window.visualViewport?.width;
    if (!viewportSize) return;

    setDevice(viewportSize <= MAX_SIZE_MOBILE ? Size.Mobile : Size.Desktop);
  }, []);

  return { device };
};
