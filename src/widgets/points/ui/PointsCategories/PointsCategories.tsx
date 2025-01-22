import { FC, useState } from "react";
import { v1 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CategoryItem } from "@/shared/components";

import s from "./PointsCategories.module.sass";

interface PointsCategoriesProps {}

const mockData = [
    { id: v1(), title: "Category", icon: "diamond" },
    { id: v1(), title: "Category", icon: "diamond" },
    { id: v1(), title: "Category", icon: "diamond" },
    { id: v1(), title: "Category", icon: "diamond" }
];

export const PointsCategories: FC<PointsCategoriesProps> = ({}) => {
    const [isShowMore, setIsShowMore] = useState<boolean>(false);
    const { t } = useTranslation();

    const navigate = useNavigate();

    const visibleItems = isShowMore ? mockData : mockData.slice(0, 4);

    return (
        <div className={s.block}>
            {visibleItems.map(c => (
                <CategoryItem
                    key={v1()}
                    icon={c.icon}
                    type="dark-grey"
                    title={c.title}
                    onClick={() => {}}
                />
            ))}

            {mockData.length > 4 && (
                <CategoryItem
                    icon="show-more2"
                    title={isShowMore ? t("common.show-less") : t("common.show-more")}
                    type="dark-grey"
                    onClick={() => setIsShowMore(prev => !prev)}
                />
            )}
        </div>
    );
};
