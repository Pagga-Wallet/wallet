import { type MainButtonParams, useMainButton } from "@tma.js/sdk-react";
import { useEffect } from "react";

interface Options {
    onClick?: () => void;
    params: Partial<MainButtonParams>;
}
/**
 * Важно! onClick всегда должен быть обёрнут в useCallback()
 */
export function useSetupMainButton({ onClick, params }: Options) {
    const mb = useMainButton();

    const hideBtn = () => {
        const bgColor = params?.isEnabled ? "#3478F6" : "#255093";
        const textColor = params?.isEnabled ? "#FFFFFF" : "#79889B";
        mb.hide();
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
            bgColor: params?.isEnabled ? "#3478F6" : "#255093",
        });

        if (onClick) {
            mb.on("click", onClick);
        }
        if (params.isVisible) {
            mb.show();
        } else {
            hideBtn();
        }
        return () => {
            if (onClick) mb.off("click", onClick);
        };
    }, [JSON.stringify(params), onClick]);

    useEffect(() => {
        return () => {
            hideBtn();
        };
    }, []);
}
