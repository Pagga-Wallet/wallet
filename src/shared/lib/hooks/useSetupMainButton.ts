import { mainButton, RGB } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

interface MainButtonParams {
    backgroundColor?: RGB;
    hasShineEffect: boolean;
    isEnabled: boolean;
    isLoaderVisible: boolean;
    isVisible: boolean;
    text: string;
    textColor?: RGB;
}

interface Options {
    onClick?: () => void;
    params: Partial<MainButtonParams>;
}
/**
 * Важно! onClick всегда должен быть обёрнут в useCallback()
 */
export function useSetupMainButton({ onClick, params }: Options) {
    const mb = mainButton;

    const hideBtn = () => {
        const bgColor = params?.isEnabled ? "#3478F6" : "#255093";
        const textColor = params?.isEnabled ? "#FFFFFF" : "#79889B";
        mb.unmount();
        window.Telegram.WebApp.MainButton.setParams({
            text: params.text || undefined,
            color: bgColor,
            text_color: textColor,
            is_active: params.isEnabled,
            is_visible: true,
        });
        window.Telegram.WebApp.MainButton.setParams({ is_visible: false });
    };

    useEffect(() => {
        //FIXME цвет отключенной кнопки
        mb.setParams({
            ...params,
            textColor: params?.isEnabled ? "#FFFFFF" : "#79889B",
            backgroundColor: params?.isEnabled ? "#3478F6" : "#255093",
        });

        if (onClick) {
            mb.onClick(onClick);
        }
        if (params.isVisible) {
            mb.mount();
        } else {
            hideBtn();
        }
        return () => {
            if (onClick) mb.offClick(onClick);
        };
    }, [JSON.stringify(params), onClick]);

    useEffect(() => {
        return () => {
            hideBtn();
        };
    }, []);
}
