import clsx from "clsx";
import React, { useRef } from "react";
import { useTelegramViewportHack } from "../lib/hooks/useTelegramViewportResize";

import styles from "./MainLayout.module.scss";

import { Navbar } from "./Navbar";

interface BaseLayoutProps {
    children: React.ReactNode;
    navbar?: React.ReactNode;
    className?: string;
}

export const BaseLayout = ({ children, navbar, className }: BaseLayoutProps) => {
    const scrollableRef = useRef<HTMLDivElement>(null);
    useTelegramViewportHack();
    return (
        <div className={styles.wrapper} id="mainWrapper">
            <div className={styles.bottom}>{navbar}</div>

            <div className={clsx(styles.content, className)} ref={scrollableRef}>
                {children}
            </div>
        </div>
    );
};

export const PrivateLayout = ({ children }: Omit<BaseLayoutProps, "navbar">) => {
    return <BaseLayout navbar={<Navbar />}>{children}</BaseLayout>;
};
