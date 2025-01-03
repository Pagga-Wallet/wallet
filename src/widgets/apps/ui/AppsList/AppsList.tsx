import { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { v1 } from "uuid";

import { AppItem } from "@/entities/app";

import { App } from "@/shared/api/apps";

import { useGroupedItems } from "@/shared/lib/hooks/useGroupedItems";

import s from "./AppsList.module.sass";
import { Button } from "@/shared/components";

interface AppsListProps {
    apps: App[];
    isLoading: boolean;
    onClickAll: (category: string) => void;
}

export const AppsList: FC<AppsListProps> = ({ apps, onClickAll, isLoading }) => {
    const categoryApps = useGroupedItems(apps);

    const { t } = useTranslation();

    const chunkArray = (arr: App[], size: number) => {
        return arr.reduce((chunks, item, index) => {
            const chunkIndex = Math.floor(index / size);
            if (!chunks[chunkIndex]) {
                chunks[chunkIndex] = [];
            }
            chunks[chunkIndex].push(item);
            return chunks;
        }, [] as App[][]);
    };

    const renderSection = useCallback((category: string, items: App[]) => {
        const itemChunks = chunkArray(items, 3);

        return (
            <div key={category} className={`${s.appsList}`}>
                <div className={s.appsListTop}>
                    <div className={s.appsListTitle}>
                        {category === "all-apps" ? "All apps" : category}
                    </div>

                    <Button type="grey" className={s.btn} onClick={() => onClickAll(category)}>
                        {t("common.view-all")}
                    </Button>
                </div>

                <div className={s.columnContainer}>
                    <Swiper
                        allowTouchMove={true}
                        mousewheel={{ forceToAxis: true }}
                        slidesPerView={1.1}
                        spaceBetween={8}
                        touchReleaseOnEdges={true}
                        observer={true}
                        observeParents={true}
                        className={s.swiperContainer}
                        style={{ height: "100%" }}
                    >
                        {itemChunks.map((chunk, chunkIndex) => (
                            <SwiperSlide key={v1()} className={s.swiperSlide}>
                                <div
                                    className={s.appsListBox}
                                    style={{
                                        margin: chunkIndex === 0 ? "0 0 0 16px" : "0 16px 0 0",
                                    }}
                                >
                                    {chunk.map((app, index) => (
                                        <AppItem
                                            isFirst={chunkIndex === 0 && index === 0}
                                            isLast={
                                                chunkIndex === itemChunks.length - 1 &&
                                                index === chunk.length - 1
                                            }
                                            key={v1()}
                                            {...app}
                                        />
                                    ))}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        );
    }, []);

    return (
        <>
            {Object.keys(categoryApps).map(category =>
                renderSection(category, categoryApps[category])
            )}
            {apps && renderSection("all-apps", apps)}
        </>
    );
};
