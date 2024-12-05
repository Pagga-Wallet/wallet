import { useBackButton, useMainButton } from "@tma.js/sdk-react";
import { useLayoutEffect, useMemo } from "react";
import { Routing } from "@/pages";
import { useTheme } from "@/features/theme";
import { useSetupMainButton } from "@/shared/lib";
import { AppLoader } from "./AppLoader";
import { withProviders } from "./providers";
import "./styles/themes.scss";
import "./styles/index.scss";
import { useTMAInit } from "./useTMAInit";
import "./i18n";

const App = () => {
    useTMAInit();
    useTheme();
    // КОСТЫЛЬ ДЛЯ ОБНУЛЕНИЯ КНОПОК С ПРОШЛОГО ОБНОВЛЕНИЯ СТРАНИЦЫ
    const backButton = useBackButton();
    const mainButton = useMainButton();

    useLayoutEffect(() => {
        backButton.hide();
        mainButton.hide();
    }, []);

    return (
        <AppLoader>
            <Routing />
        </AppLoader>
    );
};

export default withProviders(() => <App />);
