import { FC } from "react";

import { SkeletonRound, SkeletonSquare } from "@/shared/components/Skeletons";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import s from "./connectItem.module.sass";

interface SkeletonItemSkeletonProps {}

export const SkeletonItemSkeleton: FC<SkeletonItemSkeletonProps> = () => (
    <div className={s.item}>
        <div className={s.itemInner}>
            <SkeletonSquare />
            <div className={s.itemBody}>
                <p className={s.itemTitle}>
                    <SkeletonRound customWidth={90} height={20} />
                </p>
            </div>
        </div>
        <div className={s.itemActions}>
            <SvgSelector id="chevron-right" />
        </div>
    </div>
);
