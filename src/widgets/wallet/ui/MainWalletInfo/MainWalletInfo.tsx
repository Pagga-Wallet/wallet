import clsx from "clsx";
import { motion } from "framer-motion";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useOpenConnect } from "@/features/connect/model/connectService";
import { useQRScanner } from "@/features/qrScanner";
import {
    multichainAccountStore,
    useFetchAccountsQuery,
    useFetchTotalBalanceQuery,
} from "@/entities/multichainAccount";
import { Emoji } from "@/shared/components";
import { SkeletonRect } from "@/shared/components/Skeletons";
import { useAppSelector } from "@/shared/lib";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { checkDesktopPlatform } from "@/shared/lib/helpers/checkDesktopPlatform";
import { formatNumber } from "@/shared/lib/helpers/formatNumber";
import { getFontSize } from "@/shared/lib/helpers/getFontSize";
import { WalletsList } from "../WalletsList/WalletsList";
import s from "./MainWalletInfo.module.sass";

export const MainWalletInfo: FC = () => {
    const { t } = useTranslation();
    const [isWalletsListOpen, setIsWalletsListOpen] = useState(false);
    const navigate = useNavigate();
    const { connect } = useOpenConnect();
    const [scanHandle] = useQRScanner({ connect });
    const currentAccount = useAppSelector(multichainAccountStore.selectors.selectAccount);

    const onReceive = () => {
        navigate("/receive");
    };

    const isDesktop = checkDesktopPlatform();

    const { data: accounts } = useFetchAccountsQuery();

    const currentAccountName = accounts?.find((account) => account?.id === currentAccount?.id);

    const {
        data: accountBalance,
        refetch: refetchBalance,
        isFetching,
    } = useFetchTotalBalanceQuery();

    const [rotation, setRotation] = useState<number>(0);

    const handleReload = () => {
        setRotation(rotation + 360);
        refetchBalance();
    };

    return (
        <div className={s.info}>
            {isWalletsListOpen && <WalletsList onClose={() => setIsWalletsListOpen(false)} />}
            <div className={s.top}>
                <button className={s.icon_button} disabled={isDesktop} onClick={scanHandle}>
                    <SvgSelector id="qr-code-2" />
                </button>
                {currentAccount && (
                    <div
                        className={clsx(s.address, s.addressInner)}
                        onClick={() => setIsWalletsListOpen(true)}
                    >
                        <Emoji className="wallet-emoji" id={Number(currentAccount?.emojiId || 0)} />
                        <div className={s.address}>
                            {currentAccountName?.name ||
                                t("wallet.default-name", {
                                    id: `${parseInt(currentAccount.id) + 1}`,
                                })}
                        </div>
                        <SvgSelector id="chevron-bottom-white" />
                    </div>
                )}
                <motion.button
                    className={clsx(s.icon_button, s.icon_buttonReload)}
                    animate={{ rotate: rotation }}
                    transition={{ duration: 0.6 }}
                    onClick={handleReload}
                    disabled={isFetching}
                >
                    <SvgSelector id="reload" />
                </motion.button>
            </div>

            <div
                className={s.balance}
                style={{
                    fontSize: getFontSize(formatNumber(String(accountBalance?.totalUSDBalance))),
                }}
            >
                {isFetching ? (
                    <SkeletonRect height={40} width={200} />
                ) : (
                    "$" + formatNumber(String(accountBalance?.totalUSDBalance))
                )}
            </div>

            <div className={clsx(s.bottom, { [s["bottomDisabled"]]: isFetching })}>
                <div className={s.action} onClick={() => navigate("/swap")}>
                    <button className={s.icon_button}>
                        <SvgSelector id="swap-icon-white" />
                    </button>
                    <div className={s.title}>{t("menu.swap")}</div>
                </div>
                <div className={s.action} onClick={() => navigate("/send")}>
                    <button className={s.icon_button}>
                        <SvgSelector id="send" />
                    </button>
                    <div className={s.title}>{t("main.send-btn")}</div>
                </div>
                <div className={s.action} onClick={onReceive}>
                    <button className={s.icon_button}>
                        <SvgSelector id="receive" />
                    </button>
                    <div className={s.title}>{t("main.receive-btn")}</div>
                </div>
            </div>

            <div className={s.headerBg}>
                <SvgSelector id="header-bg" />
            </div>
        </div>
    );
};
