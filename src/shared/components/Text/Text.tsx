import clsx from "clsx";
import React from "react";
import styles from "./Text.module.scss";

interface TextProps {
    children: React.ReactNode;
    type?: "secondary" | "primary";
    size?: "small" | "medium" | "large";
    className?: string;
}
export const Text = ({ children, type = "primary", size = "medium", className }: TextProps) => {
    return (
        <span
            className={clsx(
                styles.text,
                {
                    [styles[`text--${type}`]]: type,
                    [styles[`text--${size}`]]: size,
                },
                className
            )}
        >
            {children}
        </span>
    );
};
