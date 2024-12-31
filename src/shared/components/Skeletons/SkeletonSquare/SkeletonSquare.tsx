import { FC } from "react";
import ContentLoader, { IContentLoaderProps } from "react-content-loader";

interface SkeletonSquareProps extends IContentLoaderProps {}

export const SkeletonSquare: FC<SkeletonSquareProps> = ({ ...props }) => (
    <ContentLoader
        speed={2}
        width={40}
        height={40}
        viewBox="0 0 40 40"
        backgroundColor={"rgba(var(--foreground-secondary), 0.8)"}
        foregroundColor={"rgb(var(--foreground-secondary))"}
        {...props}
    >
        <circle cx="20" cy="20" r="20" />
    </ContentLoader>
);
