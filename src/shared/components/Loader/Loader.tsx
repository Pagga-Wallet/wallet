import { clsx } from "clsx";

import LOADER from "@/shared/lib/gifs/loader.gif";

import styles from "./Loader.module.scss";

export const Loader = () => {
    return (
        <div className={styles.wrapper}>
            <div
                className={clsx(styles.loader, {
                    [styles.loaderFs]: window?.Telegram?.WebApp?.isFullscreen
                })}
            >
                <img
                    src={LOADER}
                    alt="Loading..."
                    width={132}
                    height={132}
                    className={styles.image}
                />
            </div>
        </div>
    );
};
