import { useCallback } from "react";
import { useStrictContext } from "@/shared/lib/react";
import { pinCreationContext } from "./context";

export const usePINCreation = () => {
    const { open, setListeners } = useStrictContext(pinCreationContext);

    const createPIN = useCallback(
        () =>
            new Promise<string>((resolve, reject) => {
                setListeners({
                    resolve,
                    reject,
                });
                open();
            }),
        [setListeners, open]
    );

    return {
        createPIN,
    };
};
