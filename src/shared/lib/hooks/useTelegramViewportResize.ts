import { useCallback, useEffect, useState } from "react";

// Fix iOS issue with virtual keyboard
// Scroll page up when keyboard is hidden
export const useTelegramViewportHack = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    const handleKeyboardHide = useCallback(() => {
        if (keyboardVisible) {
            window.scrollTo(0, scrollPosition);
            setKeyboardVisible(false);
        }
    }, [keyboardVisible, scrollPosition]);

    const handleKeyboardShow = useCallback(() => {
        if (!keyboardVisible) {
            setScrollPosition(window.scrollY);
            setKeyboardVisible(true);
        }
    }, [keyboardVisible]);

    useEffect(() => {
        if (!isIOS()) return;

        const handleBlur = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
                handleKeyboardHide();
            }
        };

        const handleFocus = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
                handleKeyboardShow();
            }
        };

        document.addEventListener("blur", handleBlur, true);
        document.addEventListener("focus", handleFocus, true);

        return () => {
            document.removeEventListener("blur", handleBlur, true);
            document.removeEventListener("focus", handleFocus, true);
        };
    }, [handleKeyboardHide, handleKeyboardShow]);
};
