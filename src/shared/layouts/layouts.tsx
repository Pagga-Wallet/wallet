import React, { useRef } from "react";
import clsx, { ClassValue } from "clsx";

import { useTelegramViewportHack } from "../lib/hooks/useTelegramViewportResize";

import styles from "./MainLayout.module.scss";

import { Navbar } from "./Navbar";

interface BaseLayoutProps {
    children: React.ReactNode;
    navbar?: React.ReactNode;
    className?: string;
    withoutPadding?: boolean;
    classNameWrapper?: ClassValue;
    withDecor?: boolean; // Add only decor
}

export const BaseLayout = ({
    children,
    navbar,
    className,
    classNameWrapper,
    withoutPadding,
    withDecor
}: BaseLayoutProps) => {
    const scrollableRef = useRef<HTMLDivElement>(null);
    useTelegramViewportHack();
    return (
        <div
            className={clsx(styles.wrapper, classNameWrapper, {
                [styles.wrapperDecor]: withDecor,
                [styles.wrapperFs]: window?.Telegram?.WebApp?.isFullscreen && !withoutPadding
            })}
            id="mainWrapper"
        >
            <div className={styles.bottom}>{navbar}</div>
            {withDecor && <div className={styles.innerDecor}></div>}
            <div
                className={clsx(styles.content, className, {
                    [styles.contentZero]: !window?.Telegram?.WebApp?.isFullscreen && withoutPadding
                })}
                ref={scrollableRef}
            >
                {children}
            </div>
        </div>
    );
};

export const PrivateLayout = ({
    children,
    withDecor,
    ...rest
}: Omit<BaseLayoutProps, "navbar">) => {
    return (
        <BaseLayout navbar={<Navbar />} withDecor={withDecor} {...rest}>
            {withDecor && <div className={styles.innerDecor}></div>}
            {children}
        </BaseLayout>
    );
};

// Decor with rounded div
export const WithDecorLayout = ({
    children,
    withoutPadding = false,
    className
}: Omit<BaseLayoutProps, "navbar">) => {
    return (
        <div className={styles.inner}>
            <div className={styles.innerDecor}></div>
            <div
                className={clsx(styles.innerContent, className, {
                    [styles.contentZero]: withoutPadding,
                    [styles.innerContentFs]:
                        window?.Telegram?.WebApp?.isFullscreen && !withoutPadding
                })}
            >
                {children}
            </div>
        </div>
    );
};
