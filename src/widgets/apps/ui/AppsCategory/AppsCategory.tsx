import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { v1 } from "uuid";
import { Title } from "@/shared/components";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { categoryMock } from "@/shared/lib/consts/apps/apps-mock";
import { CategoryItem } from "@/shared/components";
import s from "./AppsCategory.module.sass";

interface AppsCategoryProps {}

export const AppsCategory: FC<AppsCategoryProps> = () => {
    const [isShowMore, setIsShowMore] = useState<boolean>(false);
    const { t } = useTranslation();

    const visibleItems = isShowMore ? categoryMock : categoryMock.slice(0, 3);

    return (
        <div className={s.block}>
            <Title level={3} className={s.blockTitle}>
                Pagg<span>AI</span> <SvgSelector id="star-decor" />
            </Title>
            <div className={s.blockItems}>
                {visibleItems.map(c => (
                    <CategoryItem key={v1()} {...c} />
                ))}

                {categoryMock.length > 3 && (
                    <CategoryItem
                        icon="show-more2"
                        title={isShowMore ? t("common.show-less") : t("common.show-more")}
                        onClick={() => setIsShowMore(prev => !prev)}
                    />
                )}
            </div>
        </div>
    );
};
