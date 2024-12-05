import { useMiniApp, postEvent } from "@tma.js/sdk-react";
import { useEffect } from "react";
import { themeStore } from "@/features/theme";
import { useAppSelector } from "@/shared/lib";

export const useTMAInit = () => {
    const miniApp = useMiniApp();
    const theme = useAppSelector(themeStore.selectors.selectTheme);

    const backColor = theme === "dark" ? "#212325" : "#212325";

    useEffect(() => {
        miniApp.ready();
        miniApp.setHeaderColor(backColor);
        miniApp.setBgColor(backColor);
        postEvent("web_app_expand");
    }, [miniApp, backColor]);
};
