"use client";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/pagination";
import { useDevice } from "@/shared/client/hooks/ui/useDevice";
import { slidesPerView } from "@/shared/utils/helpers";
import { SwiperButtons } from "../buttons/SwiperButtons";
import { CarouselCard } from "../cards/CarouselCard";
import { use } from "react";
import { ContentElement } from "@shared-types/content.types";

export function CarouselSwiper({
  data,
  title,
}: {
  data: Promise<ContentElement[] | null>;
  title?: string;
}) {
  const { isMobile, size } = useDevice();
  const content = use(data);
  if (!content) return;
  const slidesPerViewAmount = slidesPerView(isMobile, size);
  return (
    <>
      {title && <h2 className="h-12 font-semibold text-2xl ">{title}</h2>}
      <Swiper
        style={{ position: "initial" }}
        className="w-full [&>.swiper-wrapper]:gap-8"
        modules={[Navigation]}
        slidesPerView={slidesPerViewAmount}
        spaceBetween={16}
      >
        {content && content?.length > slidesPerViewAmount && <SwiperButtons />}
        {content &&
          content.map((element, i) => {
            return (
              <SwiperSlide className="!w-40 !m-0" key={i}>
                <CarouselCard element={element} />
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
}
