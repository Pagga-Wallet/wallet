import React, { FC } from "react";
import clsx from "clsx";

import { SkeletonRound } from "@/shared/components/Skeletons";

import s from "./TokenListItem.module.sass";

interface TokenListItemSkeletonProps {
    count?: number;
}

const Skeleton = (
    <div className={clsx(s.token, s.tokenNoHover)}>
        <div className={s.left}>
            <SkeletonRound customWidth={40} height={40} style={{ borderRadius: '50%' }} />
            <div className={s.info}>
                <div className={s.name}>
                    <SkeletonRound customWidth={60} height={20} />
                </div>
                <div className={s.price}>
                    <div className={s.priceInfo}>
                        <SkeletonRound customWidth={40} height={18} />
                    </div>
                    <SkeletonRound customWidth={40} height={18} />
                    {/* <span className={s.priceChange}>+2.3%</span> */}
                </div>
            </div>
        </div>
        <div className={s.total}>
            <SkeletonRound customWidth={50} height={19} />
            <div className={s.totalAmount}>
                {" "}
                <SkeletonRound customWidth={50} height={19} />
            </div>
        </div>
    </div>
);

export const TokenListItemSkeleton: FC<TokenListItemSkeletonProps> = React.memo(({ count = 1 }) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(Skeleton);
    }
    return arr;
});
