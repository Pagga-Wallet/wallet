import { useEffect, useCallback, RefObject } from "react";

type RefType = RefObject<HTMLElement> | RefObject<HTMLElement>[];

export const useHandleClickOutside = (
    refs: RefType,
    callback: () => void,
    modalWindowId?: string
): void => {
    const handleClickOutside = useCallback(
        (e: MouseEvent) => {
            const isOutsideAllRefs = () => {
                if (Array.isArray(refs)) {
                    return refs.every(
                        (ref) => ref.current && !e.composedPath().includes(ref.current)
                    );
                } else {
                    return refs.current && !e.composedPath().includes(refs.current);
                }
            };

            if (isOutsideAllRefs()) {
                callback();
            }
        },
        [refs, callback]
    );

    useEffect(() => {
        const modalWindowElement = modalWindowId ? document.getElementById(modalWindowId) : null;

        if (!modalWindowId || !modalWindowElement) {
            document.addEventListener("mousedown", handleClickOutside, false);

            return () => {
                document.removeEventListener("mousedown", handleClickOutside, false);
            };
        }
    }, [refs, modalWindowId, handleClickOutside]);
};
