import { FC } from "react";
import ContentLoader, { IContentLoaderProps } from "react-content-loader";
import styles from "./SkeletonRect.module.scss";

interface SkeletonRectProps extends IContentLoaderProps {
    width: number | string;
    height: number;
    borderRadius?: number;
}

export const SkeletonRect: FC<SkeletonRectProps> = ({
    borderRadius = "16px",
    width,
    height,
    ...props
}) => (
    <ContentLoader
        speed={2}
        viewBox={`0 0 ${width} ${height}`}
        backgroundColor={"rgba(var(--foreground-primary), 0.8)"}
        foregroundColor={"rgb(var(--foreground-primary))"}
        width={width}
        height={height}
        style={{
            borderRadius,
        }}
        className={styles.skeleton}
        {...props}
    >
        <rect x="0" y="0" rx="4" ry="4" width={width} height={height} />
    </ContentLoader>
);
