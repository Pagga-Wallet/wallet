import { FC } from "react";

import { PointsItem } from "@/shared/api/points/lib/types";

import POINTS_BG from "@/shared/lib/images/points-bg-example.png";
import POINTS_CATEGORY from "@/shared/lib/images/points-category-example.png";

import s from "./PointsItemsList.module.sass";
import { PointsListItem } from "@/entities/points/PointsLitsItem/PointsListItem";

interface PointsItemsListProps {}

const pointsItems: PointsItem[] = [
    {
        id: 1,
        title: "eSim service",
        description: "Internet, minutes and SMS in another country",
        background_img_url: POINTS_BG,
        category_img_url: POINTS_CATEGORY,
        points: 10
    },
    {
        id: 2,
        title: "eSim service",
        description: "Internet, minutes and SMS in another country",
        background_img_url: POINTS_BG,
        category_img_url: POINTS_CATEGORY,
        points: 20
    },
    {
        id: 3,
        title: "eSim service",
        description: "Internet, minutes and SMS in another country",
        background_img_url: POINTS_BG,
        category_img_url: POINTS_CATEGORY,
        points: 30
    },
    {
        id: 4,
        title: "eSim service",
        description: "Internet, minutes and SMS in another country",
        background_img_url: POINTS_BG,
        category_img_url: POINTS_CATEGORY,
        points: 40
    },
    {
        id: 5,
        title: "eSim service",
        description: "Internet, minutes and SMS in another country",
        background_img_url: POINTS_BG,
        category_img_url: POINTS_CATEGORY,
        points: 50
    }
];

export const PointsItemsList: FC<PointsItemsListProps> = ({}) => {
    return (
        <div className={s.list}>
            {pointsItems.map(p => (
                <PointsListItem key={p.id} {...p} />
            ))}
        </div>
    );
};
