import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
// eslint-disable-next-line boundaries/element-types
import { multichainAccountStore } from "@/entities/multichainAccount";
import { Emoji } from "@/shared/components";
import { useAppSelector } from "@/shared/lib";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { WalletsList } from "../WalletsList/WalletList";
import styles from "./AccountSelector.module.scss";

export const AccountSelector = () => {
    const [isWalletsListOpen, setIsWalletsListOpen] = useState(false);
    const { t } = useTranslation();
    const currentAccount = useAppSelector(multichainAccountStore.selectors.selectAccount);
    return (
        <>
            {isWalletsListOpen && <WalletsList onClose={() => setIsWalletsListOpen(false)} />}
            <div
                className={clsx(styles.address, styles.addressInner)}
                onClick={() => setIsWalletsListOpen(true)}
            >
                <Emoji id={Number(currentAccount?.emojiId || 0)} />
                <div className={styles.address}>
                    {currentAccount?.name ||
                        t("main.wallet", { id: parseInt(currentAccount?.id || "0") + 1 })}
                </div>
                <SvgSelector id="chevron-bottom-white" />
            </div>
        </>
    );
};
