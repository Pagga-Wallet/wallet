import { useCallback, useEffect, useState } from "react";

export const useTelegramViewportHack = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const isIOS = useCallback(() => /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream, []);

    useEffect(() => {
        if (!isIOS()) return;

        const handleResize = () => {
            const viewportHeight = window.innerHeight;
            const isKeyboardNowVisible = viewportHeight < screen.height * 0.75;

            if (isKeyboardNowVisible && !keyboardVisible) {
                setScrollPosition(window.scrollY);
                setKeyboardVisible(true);
            } else if (!isKeyboardNowVisible && keyboardVisible) {
                setTimeout(() => {
                    window.scrollTo(0, scrollPosition);
                }, 100);
                setKeyboardVisible(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isIOS, keyboardVisible, scrollPosition]);
};
