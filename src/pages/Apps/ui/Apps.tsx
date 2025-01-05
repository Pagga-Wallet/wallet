import { FC, useState } from "react";

import { AppsBanners, AppsList } from "@/widgets/apps/ui";

import { BaseLayout, PrivateLayout } from "@/shared/layouts";

import { appsBannersMock } from "@/shared/lib/consts/apps/apps-banners-mock";
import { appsMock } from "@/shared/lib/consts/apps/apps-mock";
import { App } from "@/shared/api/apps";

import s from "./Apps.module.sass";
import { AppsListSingle } from "./AppsListSingle";
import { useSetupBackButton } from "@/shared/lib";

interface AppsProps {}

export const Apps: FC<AppsProps> = ({}) => {
    const [appCategory, setAppCategory] = useState<string | null>(null);
    
    useSetupBackButton({
        visible: !!appCategory,
        onBack: () => setAppCategory(null)
    });

    if (appCategory) {
        return (
          <BaseLayout withDecor>
              <AppsListSingle
                  apps={appsMock.filter(a => a.category.includes(appCategory))}
                  category={(appCategory as unknown) as string}
              />
          </BaseLayout>
        );
    }

    const handleViewAll = (category: string) => {
        setAppCategory(category);
    };

    return (
        <PrivateLayout withDecor>
            <AppsBanners banners={appsBannersMock} />

            <div className={s.content}>
                <AppsList isLoading={false} apps={appsMock} onClickAll={handleViewAll} />
            </div>
        </PrivateLayout>
    );
};
