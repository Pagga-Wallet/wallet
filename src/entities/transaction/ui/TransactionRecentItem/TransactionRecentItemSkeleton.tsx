import { FC } from "react";

import { SkeletonRound, SkeletonSquare } from "@/shared/components/Skeletons";

import s from "./TransactionRecentItem.module.sass";

interface TransactionRecentItemSkeletonProps {}

export const TransactionRecentItemSkeleton: FC<TransactionRecentItemSkeletonProps> = () => (
    <div className={s.recent}>
        <div className={s.recentLogo}>
            <SkeletonSquare />
        </div>
        <div className={s.recentInfo}>
            <p className={s.recentInfoAddress}>
                <SkeletonRound height={19} />
            </p>
            <div className={s.recentInfoDate}>
                <SkeletonRound height={18} customWidth="100px" />
            </div>
        </div>
    </div>
);
