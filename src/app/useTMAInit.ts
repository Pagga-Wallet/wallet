import { miniApp, postEvent, init } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { themeStore } from "@/features/theme";
import { useAppSelector } from "@/shared/lib";

export const useTMAInit = () => {
    const theme = useAppSelector(themeStore.selectors.selectTheme);

    const backColor = theme === "dark" ? "#212325" : "#212325";

    useEffect(() => {
        init();
        miniApp.ready();
        miniApp.setHeaderColor(backColor);
        miniApp.setBackgroundColor(backColor);
        postEvent("web_app_expand");
    }, [miniApp, backColor]);
};
