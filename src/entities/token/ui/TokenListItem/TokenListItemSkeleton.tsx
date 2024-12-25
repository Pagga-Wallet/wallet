import React, { FC } from "react";
import ContentLoader from "react-content-loader";
import s from "./TokenListItem.module.sass";

interface TokenListItemSkeletonProps {
    count?: number;
}

const Skeleton = (
    <div className={s.tokenSkeleton}>
        <ContentLoader
            speed={2}
            width={"100%"}
            height={40}
            viewBox="0 0 475 40"
            backgroundColor={"rgba(var(--foreground-secondary), 0.8)"}
            foregroundColor={"rgb(var(--foreground-secondary))"}
        >
            <circle cx="20" cy="20" r="20" />
            <rect x="48" y="30" rx="8" ry="2" width="100" height="15" />
            <rect x="48" y="5" rx="8" ry="2" width="50" height="15" />
            <rect x="400" y="5" rx="8" ry="2" width="50" height="15" />
            <rect x="400" y="30" rx="8" ry="2" width="50" height="15" />
        </ContentLoader>
    </div>
);

export const TokenListItemSkeleton: FC<TokenListItemSkeletonProps> = React.memo(({ count = 1 }) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(Skeleton);
    }
    return arr;
});
