import clsx, { ClassValue } from "clsx";
import React from "react";
import styles from "./Container.module.scss";

interface ContainerProps {
    children: React.ReactNode;
    className?: ClassValue;
}

export const Container = ({ children, className }: ContainerProps) => {
    return <div className={clsx(styles.container, className)}>{children}</div>;
};
