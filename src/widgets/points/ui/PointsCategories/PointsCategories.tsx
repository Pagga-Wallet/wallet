import { FC, useRef, useState } from "react";
import { v1 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { PointCategoryItem } from "@/entities/points";

import s from "./PointsCategories.module.sass";

interface PointsCategoriesProps {}

const mockData = [
    { id: v1(), title: "All services" },
    { id: v1(), title: "Communication" },
    { id: v1(), title: "Food" },
    { id: v1(), title: "Hotels" }
];

export const PointsCategories: FC<PointsCategoriesProps> = () => {
    const { t } = useTranslation();
    const [activeCategoryId, setActiveCategoryId] = useState<string>(mockData[0].id);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeftStart = useRef(0);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const container = containerRef.current;
        if (!container) return;
        isDown.current = true;
        startX.current = e.pageX - container.offsetLeft;
        scrollLeftStart.current = container.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDown.current = false;
    };

    const handleMouseUp = () => {
        isDown.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!isDown.current) return;
        e.preventDefault();
        const container = containerRef.current;
        if (!container) return;
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX.current) * 2;
        container.scrollLeft = scrollLeftStart.current - walk;
    };

    return (
        <div 
            className={s.block} 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ overflowX: "auto", cursor: isDown.current ? "grabbing" : "grab" }}
        >
            {mockData.map(c => (
                <PointCategoryItem
                    isActive={c.id === activeCategoryId}
                    key={c.id}
                    title={c.title}
                    onClick={() => setActiveCategoryId(c.id)}
                />
            ))}
        </div>
    );
};
