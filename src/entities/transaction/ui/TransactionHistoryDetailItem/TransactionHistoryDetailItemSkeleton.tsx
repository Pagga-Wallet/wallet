import { FC } from "react";

import { SkeletonRound, SkeletonSquare } from "@/shared/components/Skeletons";
import s from "./TransactionHistoryDetailItem.module.sass";

interface TransactionHistoryDetailItemSkeletonProps {}

export const TransactionHistoryDetailItemSkeleton: FC<
    TransactionHistoryDetailItemSkeletonProps
> = () => {
    return (
        <div className={s.transaction}>
            <div className={s.left}>
                <div className={s.transactionLogo}>
                    <SkeletonSquare />
                </div>
                <div className={s.info}>
                    <div className={s.title}>
                        <SkeletonRound height={19} />
                    </div>
                    <div className={s.details}>
                        <span className={s.detailsAddress}>
                            <SkeletonRound height={18} customWidth="90px" />
                        </span>
                    </div>
                </div>
            </div>
            <div className={s.right}>
                <div className={s.status}>
                    <SkeletonRound widthSmall />
                </div>
                <div className={s.amount}>
                    <SkeletonRound widthSmall />
                </div>
            </div>
        </div>
    );
};
