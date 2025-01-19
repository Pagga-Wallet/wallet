import { FC } from "react";

import { AppCategoryType } from "@/shared/api/apps";

import s from "./AppCategory.module.sass";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";

interface AppCategoryProps extends AppCategoryType {
  onClick?: () => void
}

export const AppCategory: FC<AppCategoryProps> = ({
  icon,
  title,
  onClick
}) => {
    return <div className={s.item} onClick={onClick}>
      <div className={s.itemIcon}>
        <SvgSelector id={icon} />
      </div>
      <div className={s.itemTitle}>
        {title}
      </div>
    </div>;
};
