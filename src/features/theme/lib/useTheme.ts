import { useEffect } from "react";
import { useAppSelector } from "@/shared/lib";
import { DATA_ATTR_KEY, LS_KEY } from "../consts";
import { themeStore } from "../model";

export const useTheme = () => {
    const theme = useAppSelector(themeStore.selectors.selectTheme);

    useEffect(() => {
        localStorage.setItem(LS_KEY, theme);
        document.documentElement.setAttribute(DATA_ATTR_KEY, theme);
    }, [theme]);
};
