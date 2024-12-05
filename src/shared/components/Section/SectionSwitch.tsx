import clsx, { ClassValue } from "clsx";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styles from "./Section.module.scss";

interface SectionSwitchProps {
    children: React.ReactNode;
    onChange?: (value: boolean) => void;
    className?: ClassValue;
    disabled?: boolean;
    value?: boolean;
}

export const SectionSwitch = ({
    children,
    onChange,
    className,
    disabled,
    value,
}: SectionSwitchProps) => {
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        setIsOn(!!value);
    }, [value]);

    const toggleSwitch = () => {
        setIsOn(!isOn);
        onChange?.(!isOn);
    };

    return (
        <div
            className={clsx(
                styles.item,
                {
                    [styles["item--disabled"]]: disabled,
                },
                className
            )}
            onClick={toggleSwitch}
        >
            {children}
            <div className={styles.switch} data-isOn={isOn}>
                <motion.div
                    className={styles.handle}
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 700,
                        damping: 30,
                    }}
                />
            </div>
        </div>
    );
};
