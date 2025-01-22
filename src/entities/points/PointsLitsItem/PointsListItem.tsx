import { FC } from "react";

import { PointsItem } from "@/shared/api/points/lib/types";

import { PointsBalance } from "../../../shared/components/PointsBalance/PointsBalance";

import s from "./PointsListItem.module.sass";

interface PointsListItemProps extends PointsItem {}

export const PointsListItem: FC<PointsListItemProps> = ({
    background_img_url,
    category_img_url,
    description,
    points,
    title
}) => {
    return (
        <div
            className={s.item}
            style={{
                backgroundImage: `url(${background_img_url})`
            }}
        >
            <div className={s.itemPoints}>
                <PointsBalance balance={points} />
            </div>

            <div className={s.itemContent}>
                <div className={s.itemContentTop}>
                    <img
                        src={category_img_url}
                        alt="category"
                        width={28}
                        height={28}
                        className={s.itemContentTopImage}
                    />
                    <p className={s.itemContentTitle}>{title}</p>
                </div>
                <p className={s.itemContentDescription}>{description}</p>
            </div>
        </div>
    );
};
