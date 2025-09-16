import { FC } from "react";

import DIAMOND_ICON from "@/shared/assets/diamond.svg?react";

import { Title } from "@/shared/components";
import s from "./PointsIntroduction.module.sass";

interface PointsIntroductionProps {}

export const PointsIntroduction: FC<PointsIntroductionProps> = ({}) => {
    return (
        <div className={s.block}>
            <div className={s.blockIcon}>
                <DIAMOND_ICON />
            </div>
            <Title level={2} className={s.blockTitle}>
                Pagga Points
            </Title>
            <p className={s.blockSubtitle}>Earn rewards on your everyday spend</p>
        </div>
    );
};
