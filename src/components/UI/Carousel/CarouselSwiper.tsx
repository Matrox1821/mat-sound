"use client";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/pagination";
import { useDevice } from "@/hooks/ui/useDevice";
import { slidesPerView } from "@/shared/helpers";
import SwiperButtons from "../Buttons/SwiperButtons";
import CarouselCard from "../Cards/CarouselCard";
import { CarousellContentProps } from "@/types/components";

export default function CarouselSwiper({ content }: { content: CarousellContentProps[] }) {
  const { isMobile, size } = useDevice();
  const slidesPerViewAmount = slidesPerView(isMobile, size);
  return (
    <Swiper
      style={{ position: "initial" }}
      className="w-full"
      modules={[Navigation]}
      slidesPerView={slidesPerViewAmount}
      spaceBetween={16}
    >
      {content && content?.length > slidesPerViewAmount && <SwiperButtons />}
      {content &&
        content.map((element, i) => {
          return (
            <SwiperSlide className="!w-40" key={i}>
              <CarouselCard element={element} />
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
}
