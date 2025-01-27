import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppsBanners, AppsCategory, AppsList } from "@/widgets/apps/ui";

import { BaseLayout, PrivateLayout } from "@/shared/layouts";

import { appsBannersMock } from "@/shared/lib/consts/apps/apps-banners-mock";
import { appsMock } from "@/shared/lib/consts/apps/apps-mock";
import { App } from "@/shared/api/apps";

import { WithDecorLayout } from "@/shared/layouts/layouts";

import { AppsListSingle } from "./AppsListSingle";

import { useSetupBackButton } from "@/shared/lib";

import s from "./Apps.module.sass";

interface AppsProps {}

export const Apps: FC<AppsProps> = ({}) => {
    const [appCategory, setAppCategory] = useState<string | null>(null);

    const { t } = useTranslation();

    useSetupBackButton({
        visible: !!appCategory,
        onBack: () => setAppCategory(null)
    });

    if (appCategory) {
        return (
            <BaseLayout withoutPadding withDecor classNameWrapper={s.singleContent}>
                <AppsListSingle
                    apps={
                        appCategory === "all-apps"
                            ? appsMock
                            : appsMock.filter(a => a.category.includes(appCategory))
                    }
                    category={
                        appCategory === "all-apps"
                            ? t("common.all-apps")
                            : ((appCategory as unknown) as string)
                    }
                />
            </BaseLayout>
        );
    }

    const handleViewAll = (category: string) => {
        setAppCategory(category);
    };

    return (
        <PrivateLayout withDecor className={s.inner}>
            <AppsBanners banners={appsBannersMock} />
            <div className={s.content}>
                <AppsCategory />
                <AppsList isLoading={false} apps={appsMock} onClickAll={handleViewAll} />
            </div>
        </PrivateLayout>
    );
};
