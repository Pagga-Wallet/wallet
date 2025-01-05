import { FC } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { v1 } from "uuid";

import { Banner } from "@/shared/api/apps";

import { useNavigateApps } from "@/shared/lib/hooks/useNavigateApps";

import "swiper/swiper-bundle.css";

import s from "./AppsBanners.module.sass";
import { ImageSwapper } from "./ImageSwapper";

interface AppsBannersProps {
    banners: Banner[];
}

export const AppsBanners: FC<AppsBannersProps> = ({
  banners
}) => {
    const navigateApps = useNavigateApps()

    return (
        <Swiper
            allowTouchMove={true}
            mousewheel={{ forceToAxis: true }}
            autoplay={{ delay: 4000 }}
            spaceBetween={8}
            slidesPerView={1.03}
            centeredSlides={true}
            observer={true}
            loop={true}
            observeParents={true}
            touchReleaseOnEdges={true}
            modules={[Autoplay]}
            className={s.appList}
        >
          {banners.map((b) => (
            <SwiperSlide key={v1()} className={s.slide}>
              <div
                onClick={() => {
                  navigateApps(b?.link ?? "", b?.type)
                }}
              >
                <ImageSwapper imageUrl={b?.background}>
                  <div className={s.slideInfo}>
                    <img className={s.slideInfoPreview} src={b?.logo} alt={b?.title} /> 
                    <div className={s.slideBox}>
                      {b?.title && (
                        <div className={s.slideInfoTitle}>
                          {b?.title}
                        </div>
                      )}
                      {b?.description && (
                        <div className={s.slideInfoDescription}>
                          {b?.description}
                        </div>
                      )}
                    </div>
                  </div>
                </ImageSwapper>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
    );
};
