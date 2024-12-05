import clsx from "clsx";
import React from "react";
import styles from "./Section.module.scss";
import { SectionButton } from "./SectionButton";
import { SectionLink } from "./SectionLink";
import { SectionRadio } from "./SectionRadio";
import { SectionSwitch } from "./SectionSwitch";

interface SettingSectionProps {
    title?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}
export const Section = ({ children, title, icon, className }: SettingSectionProps) => {
    return (
        <div className={clsx(styles.section)}>
            {(icon || title) && (
                <div className={styles.section__title}>
                    {icon} {title}
                </div>
            )}
            <div className={clsx(styles.section__content, className)}>{children}</div>
        </div>
    );
};

Section.Link = SectionLink;
Section.Button = SectionButton;
Section.Radio = SectionRadio;
Section.Switch = SectionSwitch;
