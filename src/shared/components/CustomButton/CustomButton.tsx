import clsx, { ClassValue } from "clsx";
import { FC, useEffect, useState } from "react";
import { Button, ButtonProps } from "../Button/Button";

import styles from "./CustomButton.module.sass";

interface CustomButtonProps {
    isLoading?: boolean;
    firstButton: ButtonProps;
    secondaryButton?: ButtonProps;
    containerClassName?: ClassValue;
    isDisabled?: boolean;
}

export const CustomButton: FC<CustomButtonProps> = ({
    firstButton,
    secondaryButton,
    containerClassName,
    isLoading = false,
    isDisabled = false
}) => {
    const [keyboardOffset, setKeyboardOffset] = useState<number>(0);

    useEffect(() => {
        const handleResize = () => {
            if (window.visualViewport) {
                const offset = window.innerHeight - window.visualViewport.height;
                setKeyboardOffset(offset > 0 ? offset : 0);
            }
        };

        const handleFocus = () => {
            if (window.visualViewport) {
                const offset = window.innerHeight - window.visualViewport.height;
                setKeyboardOffset(offset > 0 ? offset : 0);
            }
        };

        window.visualViewport?.addEventListener("resize", handleResize);
        window.addEventListener("focus", handleFocus);

        handleResize();

        return () => {
            window.visualViewport?.removeEventListener("resize", handleResize);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    return (
        <div
            className={clsx(styles.container, containerClassName)}
            style={{
                transform: `translateY(-${keyboardOffset}px)`,
                transition: "transform 0.01s ease"
            }}
        >
            <div
                className={clsx(styles.buttonWrapper, {
                    [styles.isLoading]: isLoading,
                    [styles.disabled]: isDisabled
                })}
            >
                <Button {...firstButton} />
                {secondaryButton && <Button {...secondaryButton} />}
            </div>
        </div>
    );
};
