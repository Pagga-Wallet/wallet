import { FC } from "react";
import { clsx } from "clsx";    

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import s from "./CategoryItem.module.sass";

interface CategoryItemProps {
    icon: string;
    title: string;
    type?: 'grey' | 'dark-grey'
    onClick?: () => void;
}

export const CategoryItem: FC<CategoryItemProps> = ({ icon, title, onClick, type = 'grey' }) => {
    return (
        <div className={clsx(s.item, {
            [s.itemGrey]: type === 'grey',
            [s.itemDarkGrey]: type === 'dark-grey'
        })} onClick={onClick}>
            <div className={s.itemIcon}>
                <SvgSelector id={icon} />
            </div>
            <div className={s.itemTitle}>{title}</div>
        </div>
    );
};
