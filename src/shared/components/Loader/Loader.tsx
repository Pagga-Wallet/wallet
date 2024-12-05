import React from "react";
import styles from "./Loader.module.scss";

export const Loader = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.loader}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
            </div>
        </div>
    );
};
