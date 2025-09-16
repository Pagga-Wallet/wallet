import { useMemo } from "react";
import { App } from "@/shared/api/apps";


export const useGroupedItems = (apps: App[]) => {
    return useMemo(
        () =>
            apps.reduce<Record<string, App[]>>((acc, item) => {
                item.category?.forEach((category) => {
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(item);
                });
                return acc;
            }, {}),
        [apps]
    );
};
