import clsx from "clsx";
import { FC } from "react";

import s from "./PointCategoryItem.module.sass";

interface PointCategoryItemProps {
    isActive: boolean;
    title: string;
    onClick?: () => void;
}

export const PointCategoryItem: FC<PointCategoryItemProps> = ({ isActive, title, onClick }) => {
    return (
        <div
            className={clsx(s.categoryItem, {
                [s.categoryItemActive]: isActive
            })}
            onClick={onClick}
        >
            {title}
        </div>
    );
};
