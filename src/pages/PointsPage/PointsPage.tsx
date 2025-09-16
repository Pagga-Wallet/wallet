import { FC } from "react";


import { PointsCategories, PointsIntroduction, PointsItemsList } from "@/widgets/points/ui";
import { PointsBalance } from "@/shared/components";
import { PrivateLayout } from "@/shared/layouts";

import s from "./PointsPage.module.sass";

interface PointsPageProps {}

export const PointsPage: FC<PointsPageProps> = ({}) => {
    return (
        <PrivateLayout withDecor className={s.inner}>
            <PointsBalance balance={2536.65} />
            <PointsIntroduction />
            <div className={s.innerContent}>
                <PointsCategories />
                <PointsItemsList />
            </div>
        </PrivateLayout>
    );
};
