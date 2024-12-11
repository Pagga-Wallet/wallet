import { miniApp, postEvent, init, backButton, mainButton, biometry  } from "@telegram-apps/sdk-react";
import { useEffect, useLayoutEffect } from "react";
import { themeStore } from "@/features/theme";
import { useAppSelector } from "@/shared/lib";

export const useTMAInit = () => {
    const theme = useAppSelector(themeStore.selectors.selectTheme);

    const backColor = theme === "dark" ? "#212325" : "#212325";

    useLayoutEffect(() => {
        console.log('TMA INIT')
        init();
        miniApp.ready();
        miniApp.mount();
        backButton.mount();
        mainButton.mount();
        biometry.mount();
    }, [miniApp, backColor]);

    useEffect(() => {
        miniApp.setHeaderColor(backColor);
        miniApp.setBackgroundColor(backColor);
        postEvent("web_app_expand");
    })
};
