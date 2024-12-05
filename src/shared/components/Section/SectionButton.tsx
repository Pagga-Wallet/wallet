import clsx, { ClassValue } from "clsx";
import React from "react";
import styles from "./Section.module.scss";

interface SectionButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    danger?: boolean;
    disabled?: boolean;
    className?: ClassValue;
}
export const SectionButton = ({
    children,
    onClick,
    danger,
    disabled,
    className,
}: SectionButtonProps) => {
    return (
        <button
            className={clsx(styles.item, {
                [styles["item--danger"]]: danger,
                [styles["item--disabled"]]: disabled,
                className,
            })}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
