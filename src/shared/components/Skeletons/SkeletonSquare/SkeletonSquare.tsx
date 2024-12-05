import { FC } from "react";
import ContentLoader, { IContentLoaderProps } from "react-content-loader";

interface SkeletonSquareProps extends IContentLoaderProps {}

export const SkeletonSquare: FC<SkeletonSquareProps> = ({ ...props }) => (
    <ContentLoader
        speed={2}
        width={40}
        height={40}
        viewBox="0 0 40 40"
        backgroundColor={"rgb(var(--secondary-bg))"}
        foregroundColor={"rgb(var(--tertiary-bg))"}
        {...props}
    >
        <circle cx="20" cy="20" r="20" />
    </ContentLoader>
);
