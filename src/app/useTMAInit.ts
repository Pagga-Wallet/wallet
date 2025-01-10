import { miniApp, postEvent, init, backButton, mainButton, biometry  } from "@telegram-apps/sdk-react";
import { useEffect, useLayoutEffect } from "react";
import { themeStore } from "@/features/theme";
import { useAppSelector } from "@/shared/lib";

export const useTMAInit = () => {
    const theme = useAppSelector(themeStore.selectors.selectTheme);

    const backColor = theme === "dark" ? "#1f1f25" : "#212325";

    const applySafeAreaInsets = () => {
        const { top, bottom, left, right } = window.Telegram.WebApp.contentSafeAreaInset || {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };

        window.document.body.style.paddingTop = `${top + 35}px`;
        window.document.body.style.paddingBottom = `${bottom}px`;
        window.document.body.style.paddingLeft = `${left}px`;
        window.document.body.style.paddingRight = `${right}px`;
    };

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
        if (window?.Telegram?.WebApp?.isFullscreen) {
            applySafeAreaInsets();
        }
    })
};
