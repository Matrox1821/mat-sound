"use client";
import { MAX_SIZE_MOBILE } from "@/shared/utils/constants";
import { useEffect, useState } from "react";

export const useDevice = () => {
  const [size, setSize] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const viewportSize = window.visualViewport?.width;
    if (!viewportSize) return;

    setSize(viewportSize);
    setIsMobile(viewportSize <= MAX_SIZE_MOBILE);
    setIsDesktop(viewportSize >= MAX_SIZE_MOBILE);
  }, []);

  return { size, isMobile, isDesktop };
};
