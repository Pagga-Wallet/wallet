import { useBackButton } from "@tma.js/sdk-react";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonOptions {
    onBack?(): void;
}
/** 
    @param deps - Костыль для принудительного обновления кнопки по зависимостям.
    Решает проблему двойной инициализации кнопки в рамках одного view
*/
export const useSetupBackButton = (options?: BackButtonOptions, deps: any[] = []) => {
    const backButton = useBackButton();
    const navigate = useNavigate();

    const onClick = useCallback(() => {
        if (options?.onBack) {
            options.onBack();
        } else {
            console.log("back");
            navigate(-1);
        }
    }, [options, JSON.stringify(deps)]);

    useEffect(() => {
        backButton.show();
        // console.log('show btn')
        return () => {
            backButton.hide();
            // console.log('hide btn')
        };
    }, [JSON.stringify(deps)]);

    useEffect(() => {
        if (onClick) {
            return backButton.on("click", onClick);
        }
    }, [onClick, JSON.stringify(deps)]);
};
