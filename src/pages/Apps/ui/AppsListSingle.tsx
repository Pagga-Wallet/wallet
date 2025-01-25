import { FC } from "react";
import { v1 } from "uuid";

import { Title } from "@/shared/components";

import { App } from "@/shared/api/apps";

import { AppItem } from "@/entities/app";

import s from "./Apps.module.sass";

interface AppsListSingleProps {
    apps: App[];
    category: string;
}

export const AppsListSingle: FC<AppsListSingleProps> = ({ apps, category }) => {
    return (
        <>
            <Title level={2} className={s.appsListSingle}>
                {category}
            </Title>

            <div
                className={s.contentSingle}
            >
                {apps.map((a, index) => (
                    <AppItem isFirst={index === 0} isLast={false} key={v1()} isSingle {...a} />
                ))}
            </div>
        </>
    );
};
