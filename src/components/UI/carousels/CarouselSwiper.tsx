"use client";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/pagination";
import { useDevice } from "@/shared/client/hooks/ui/useDevice";
import { slidesPerView } from "@/shared/utils/helpers";
import SwiperButtons from "../buttons/SwiperButtons";
import CarouselCard from "../cards/CarouselCard";
import { use } from "react";
import { contentProps } from "@/types/common.types";

export default function CarouselSwiper({ data }: { data: Promise<contentProps[] | undefined> }) {
  const { isMobile, size } = useDevice();
  if (!data) return;
  const content = use(data);
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
