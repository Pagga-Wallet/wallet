import clsx, { ClassValue } from "clsx";
import React, { HTMLAttributeAnchorTarget } from "react";
import { Link as BaseLink } from "@/shared/components";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import styles from "./Section.module.scss";

interface SectionLinkProps {
    children: React.ReactNode;
    to: string;
    target?: HTMLAttributeAnchorTarget | undefined;
    className?: ClassValue;
    state?: any;
    disabled?: boolean;
    oneElement?: boolean;
}

export const SectionLink = ({
    children,
    to,
    target,
    className,
    state,
    disabled,
    oneElement,
}: SectionLinkProps) => {
    return (
        <BaseLink
            to={to}
            state={state}
            className={clsx(
                styles.item,
                {
                    [styles["item--disabled"]]: disabled,
                    [styles["item--oneElement"]]: oneElement,
                },
                className
            )}
            target={target}
        >
            {children}{" "}
            <span className={styles.item__icon}>
                <SvgSelector id="chevron-right-gray" />
            </span>
        </BaseLink>
    );
};
