import { FC } from "react";
import ContentLoader from "react-content-loader";

interface SkeletonRoundProps {
    widthFull?: boolean;
    widthHalf?: boolean;
    widthSmall?: boolean;
    customWidth?: string | number;
    height?: number;
}

export const SkeletonRound: FC<SkeletonRoundProps> = ({
    widthFull = false,
    widthHalf = false,
    widthSmall = false,
    customWidth,
    height = 20,
    ...rest
}) => {
    const widthValue = customWidth || (widthFull ? 110 : widthHalf ? 85 : widthSmall ? 50 : 60);

    return (
        <ContentLoader
            speed={2}
            width={widthValue}
            height={height}
            viewBox={`0 0 ${widthValue} ${height}`}
            backgroundColor={"rgb(var(--secondary-bg))"}
            foregroundColor={"rgb(var(--tertiary-bg))"}
            {...rest}
        >
            <rect x="0" y="0" rx="10" ry="10" width="100%" height={height} />
        </ContentLoader>
    );
};
