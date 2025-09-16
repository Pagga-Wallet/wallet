import { hapticFeedback } from "@telegram-apps/sdk-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BaseLayout, PrivateLayout, WithDecorLayout } from "@/shared/layouts/layouts";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import styles from "./PINPad.module.scss";

export interface PINPadProps {
    title: string;
    state?: "success" | "failure" | undefined;
    onChange?: (value: string) => void;
    onChangeState?: (state?: "success" | "failure" | undefined) => void;
    value?: string;
    subtitle?: string;
    action?: React.ReactNode;
    disabled?: boolean;
}

const PIN_CODE_LENGTH = 4;
const ANIMATION_DURATION = 0.2;

const delay = (delayInms: number) => new Promise(resolve => setTimeout(resolve, delayInms));

export const PINPad = ({
    title,
    state,
    action,
    value = "",
    onChange,
    onChangeState,
    subtitle,
    disabled
}: PINPadProps) => {
    const [code, setCode] = useState("");
    const hapticApi = hapticFeedback;

    const lastFilledIndex = code.length - 1;

    const onDigitClick = (digit: number) => {
        if (code.length >= PIN_CODE_LENGTH) {
            return;
        }
        const updatedPIN = code + digit;
        setCode(updatedPIN);
        onChange?.(updatedPIN);
    };

    const onReturnClick = () => {
        if (code.length === 0) {
            return;
        }
        const updatedPIN = code.slice(0, -1);
        setCode(updatedPIN);
    };

    useEffect(() => {
        setCode(value);
    }, [value]);

    const errorClean = async () => {
        setCode(code => code.slice(0, 3));
        await delay(100);
        setCode(code => code.slice(0, 2));
        await delay(100);
        setCode(code => code.slice(0, 1));
        await delay(100);
        setCode("");
        onChangeState?.(undefined);
    };

    const animateError = async () => {
        await delay(350);
        await errorClean();
        await delay(100);
    };

    useEffect(() => {
        if (state === "failure") {
            hapticApi.notificationOccurred("error");
            animateError();
        }
        if (state === "success") {
            hapticApi.notificationOccurred("success");
        }
    }, [state]);

    return (
        <WithDecorLayout
            className={styles.pincode}
            withoutPadding
            style={{
                bottom: window?.Telegram?.WebApp?.isFullscreen ? "80px" : "0"
            }}
        >
            {action && <div className={styles.action}>{action}</div>}
            <div className={styles.top}>
                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                <div className={styles.topTitle}>{title}</div>
                <motion.div
                    className={styles.dots}
                    transition={{
                        duration: state === "success" ? 0.25 : state === "failure" ? 0.3 : 0
                    }}
                    animate={{
                        scale: state === "success" ? [1, 1.15, 1] : 1,
                        x: state === "failure" ? [-5, 5, -5, 5, -5, 0] : 0
                    }}
                >
                    {[1, 2, 3, 4].map((item, index) => (
                        <motion.div
                            key={item}
                            className={clsx(styles.dotsItem, {
                                [styles.active]: code.length >= item,
                                [styles.success]: index <= lastFilledIndex && state === "success",
                                [styles.failure]: index <= lastFilledIndex && state === "failure"
                            })}
                            animate={
                                index === lastFilledIndex ? { scale: [1, 1.2, 1] } : { scale: 1 }
                            }
                            transition={{ duration: ANIMATION_DURATION }}
                        />
                    ))}
                </motion.div>
            </div>
            <div className={clsx(styles.pinPad, { [styles["pinPad--disabled"]]: disabled })}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                    <button
                        key={digit}
                        className={styles.pinPadButton}
                        onClick={() => onDigitClick(digit)}
                    >
                        <div className={styles.numSymbol}>{digit}</div>
                    </button>
                ))}
                <div></div>
                <button className={styles.pinPadButton} onClick={() => onDigitClick(0)}>
                    <div className={styles.numSymbol}>0</div>
                </button>
                <button className={styles.delete} onClick={onReturnClick}>
                    <SvgSelector id="pinpud-delete" />
                </button>
            </div>
        </WithDecorLayout>
    );
};
