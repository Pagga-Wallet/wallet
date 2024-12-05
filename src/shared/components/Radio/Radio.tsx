import clsx from "clsx";
import React from "react";
import styles from "./Radio.module.scss";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    children?: React.ReactNode;
}

export const Radio = ({ className, children, ...props }: RadioProps) => {
    return (
        <label className={className}>
            {children}
            <input {...props} className={styles.radio} type="radio" />
        </label>
    );
};
