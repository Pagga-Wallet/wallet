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
        mb.setParams({ isVisible: false });
    };

    useEffect(() => {
        //FIXME цвет отключенной кнопки
        mb.mount();
        mb.setParams({
            ...params,
            textColor: params?.isEnabled ? "#FFFFFF" : "#79889B",
            backgroundColor: params?.isEnabled ? "#3478F6" : "#255093",
        });

        if (onClick) {
            mb.onClick(onClick);
        }
        if (params.isVisible) {
            mb.setParams({
                ...params,
                isVisible: true
            });
        } else {
            hideBtn();
        }
        return () => {
            if (onClick) mb.offClick(onClick);
        };
    }, [JSON.stringify(params), onClick]);

    useEffect(() => {
        return () => {
            console.log('hide button')
            hideBtn();
        };
    }, []);
}
