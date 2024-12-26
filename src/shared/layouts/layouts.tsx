import clsx from "clsx";
import React, { useRef } from "react";
import { useTelegramViewportHack } from "../lib/hooks/useTelegramViewportResize";

import styles from "./MainLayout.module.scss";

import { Navbar } from "./Navbar";

interface BaseLayoutProps {
    children: React.ReactNode;
    navbar?: React.ReactNode;
    className?: string;
    withoutPadding?: boolean;
}

export const BaseLayout = ({ children, navbar, className, withoutPadding }: BaseLayoutProps) => {
    const scrollableRef = useRef<HTMLDivElement>(null);
    useTelegramViewportHack();
    return (
        <div className={styles.wrapper} id="mainWrapper">
            <div className={styles.bottom}>{navbar}</div>

            <div className={clsx(styles.content, className, {
                [styles.contentZero]: withoutPadding
            })} ref={scrollableRef}>
                {children}
            </div>
        </div>
    );
};

export const PrivateLayout = ({ children }: Omit<BaseLayoutProps, "navbar">) => {
    return <BaseLayout navbar={<Navbar />}>{children}</BaseLayout>;
};

export const WithDecorLayout = ({ children, withoutPadding, className }: Omit<BaseLayoutProps, 'navbar'>) => {
    return <div className={styles.inner}>
        <div className={styles.innerDecor}></div>
        <div className={clsx(styles.innerContent, className, {
                [styles.contentZero]: withoutPadding
            })}>
            {children}
        </div>
    </div>
}