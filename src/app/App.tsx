import { backButton, mainButton } from "@telegram-apps/sdk-react";
import { useLayoutEffect } from "react";
import { Routing } from "@/pages";
import { useTheme } from "@/features/theme";
import { AppLoader } from "./AppLoader";
import { withProviders } from "./providers";
import "./styles/themes.scss";
import "./styles/index.scss";
import { useTMAInit } from "./useTMAInit";
import { useTelegramViewportHack } from "@/shared/lib/hooks/useTelegramViewportResize";
import "./i18n";

const App = () => {
    useTMAInit();
    useTheme();
    useTelegramViewportHack();
    return (
        <AppLoader>
            <Routing />
        </AppLoader>
    );
};

export default withProviders(() => <App />);
