import React, { FC } from "react";
import ContentLoader from "react-content-loader";
import s from "./TokenListItem.module.sass";

interface TokenListItemSkeletonProps {
    count?: number;
}

const Skeleton = () => (
    <div className={s.tokenSkeleton}>
        <ContentLoader
            speed={2}
            width={"100%"}
            height={40}
            viewBox="0 0 350 40"
            backgroundColor={"rgb(var(--secondary-bg))"}
            foregroundColor={"rgb(var(--tertiary-bg))"}
        >
            <circle cx="20" cy="20" r="20" />
            <rect x="48" y="23" rx="2" ry="2" width="100" height="12" />
            <rect x="48" y="5" rx="2" ry="2" width="50" height="12" />
            <rect x="280" y="5" rx="2" ry="2" width="70" height="12" />
            <rect x="300" y="23" rx="2" ry="2" width="50" height="12" />
        </ContentLoader>
    </div>
);

export const TokenListItemSkeleton: FC<TokenListItemSkeletonProps> = React.memo(({ count = 1 }) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(<Skeleton key={i} />);
    }
    return arr;
});
