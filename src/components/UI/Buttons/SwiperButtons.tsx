"use client";
import { useSwiper } from "swiper/react";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import { useEffect, useState } from "react";
export default function SwiperButtons() {
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: false,
  });
  const swiper = useSwiper();

  useEffect(() => {
    swiper.on("slideChange", (swipe) => {
      setSlideConfig({ isBeginning: swipe.isBeginning, isEnd: swipe.isEnd });
    });
  }, [swiper]);
  return (
    <div className="absolute top-0 right-0 text-start flex gap-2">
      <Button
        onClick={() => swiper.slidePrev()}
        className="!bg-black/20 !h-8 !w-8 md:!h-6 md:!w-6 !p-1 flex items-center justify-center"
        outlined
        rounded
        disabled={slideConfig.isBeginning}
      >
        <i className="pi pi-chevron-left" />
      </Button>
      <Button
        onClick={() => swiper.slideNext()}
        className="!bg-black/20 !h-8 !w-8 md:!h-6 md:!w-6 !p-1 flex items-center justify-center "
        outlined
        rounded
        disabled={slideConfig.isEnd}
      >
        <i className="pi pi-chevron-right" />
      </Button>
    </div>
  );
}
