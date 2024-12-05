import React from "react";

export declare type ToastType = "info" | "success" | "error";

import { SvgSelector } from "@/shared/lib/assets/svg-selector";

import styles from "./Toast.module.sass";

interface Props {
    message: string;
    type: ToastType;
}

export const Toast: React.FC<Props> = (props) => {
    return (
        <div
            className={styles.container}
            style={{ borderColor: props.type === "success" ? "#27AE60" : "#EB5757" }}
        >
            <div className={styles.flex}>
                <div>
                    {props.type === "success" ? (
                        <SvgSelector id="success" />
                    ) : (
                        <SvgSelector id="error" />
                    )}
                </div>
                <p className={styles.message}>{props.message}</p>
            </div>
        </div>
    );
};
