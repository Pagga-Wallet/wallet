import clsx, { ClassValue } from "clsx";
import { FC } from "react";
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
    return (
        <div className={clsx(styles.container, containerClassName)}>
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
