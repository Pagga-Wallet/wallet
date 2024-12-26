import clsx, { ClassValue } from "clsx";
import React from "react";
import { Radio } from "@/shared/components";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import styles from "./Section.module.scss";

interface SettingsRadioProps {
    children: React.ReactNode;
    checked?: boolean;
    onSelect?: () => void;
    className?: ClassValue;
    disabled?: boolean;
    withoutCheckbox?: boolean;
}

export const SectionRadio = ({
    children,
    checked,
    onSelect,
    className,
    disabled,
    withoutCheckbox = false
}: SettingsRadioProps) => {
    return (
        <Radio
            onClick={() => onSelect?.()}
            className={clsx(
                styles.item,
                {
                    [styles["item--disabled"]]: disabled,
                },
                className
            )}
            disabled={disabled}
        >
            {children}

            {checked && (
                <span className={styles.item__icon}>
                    <SvgSelector id={withoutCheckbox ? "checked-purple" : "checked"} />
                </span>
            )}
        </Radio>
    );
};
