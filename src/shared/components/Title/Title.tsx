import clsx from "clsx";
import React from "react";
import styles from "./Title.module.scss";

const TITLE_ELE_LIST = [1, 2, 3, 4, 5] as const;

export interface TitleProps extends React.HTMLAttributes<HTMLElement> {
    level?: (typeof TITLE_ELE_LIST)[number];
}

export const Title = ({ children, level = 1, className, ...props }: TitleProps) => {
    const Component: keyof JSX.IntrinsicElements = `h${level}`;

    return (
        <Component {...props} className={clsx(styles.title, styles[`title--${level}`], className)}>
            {children}
        </Component>
    );
};
