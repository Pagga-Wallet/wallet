import { backButton } from "@telegram-apps/sdk-react";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonOptions {
    onBack?(): void;
    visible?: boolean;
}
/** 
    @param deps - Костыль для принудительного обновления кнопки по зависимостям.
    Решает проблему двойной инициализации кнопки в рамках одного view
*/
export const useSetupBackButton = (options?: BackButtonOptions, deps: any[] = []) => {
    const navigate = useNavigate();

    const { onBack, visible = true } = options || {};

    const onClick = useCallback(() => {
        if (onBack) {
            onBack();
        } else {
            console.log("back");
            navigate(-1);
        }
    }, [options, JSON.stringify(deps)]);

    useEffect(() => {
        backButton.show();
        // return () => {
        //     backButton.hide();
        //     console.log('hide')
        // };
    }, [JSON.stringify(deps)]);

    useEffect(() => {
        if (visible) {
            backButton.show();
        } else {
            backButton.hide();
        }
    }, [visible]);
    
    useEffect(() => {
        if (onClick) {
            return backButton.onClick(onClick);
        }
    }, [onClick, JSON.stringify(deps)]);
};
