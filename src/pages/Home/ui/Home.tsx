/* eslint-disable no-irregular-whitespace */
import { miniApp } from "@telegram-apps/sdk-react";
import { motion } from "framer-motion";
import queryString from "query-string";
import { FC, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { NftList } from "@/widgets/nft";
import { TokensList } from "@/widgets/token/ui/TokensList/TokensList";
import { TransactionsHistoryList } from "@/widgets/transaction";
import { useHandleConnectMessage } from "@/features/connect";
import { useConnectEffect } from "@/features/connect/lib/useConnectEffect";
import { useOpenConnect } from "@/features/connect/model/connectService";
import { useQRScanner } from "@/features/qrScanner";
import { useFetchTotalBalanceQuery } from "@/entities/multichainAccount";
import { SkeletonRect } from "@/shared/components/Skeletons";
import { PrivateLayout } from "@/shared/layouts";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { checkDesktopPlatform } from "@/shared/lib/helpers/checkDesktopPlatform";
import { formatNumber } from "@/shared/lib/helpers/formatNumber";
import { TokenBalance } from "@/shared/lib/types/multichainAccount";
import { TokenDetailQueryObj } from "@/shared/lib/types/token";
import { CreateCard, UserInfo } from "@/shared/components";
import s from "./Home.module.scss";

export const Home: FC = () => {
    const {
        data: accountBalance,
        isFetching: accountBalanceFetching,
        refetch: refetchBalance
    } = useFetchTotalBalanceQuery();

    const navigate = useNavigate();
    const handleTokenSelect = useCallback(
        (token: TokenBalance) => {
            const query: TokenDetailQueryObj = {
                platform: token.platform,
                tokenContract: token.tokenContract,
                isNativeToken: token.isNativeToken
            };
            const url = queryString.stringifyUrl({
                url: "/token",
                query: Object(query)
            });
            navigate(url);
        },
        [navigate]
    );

    useConnectEffect();
    useHandleConnectMessage();

    useEffect(() => {
        const previousBackgroundColor = document.body.style.backgroundColor;
        document.body.style.backgroundColor = "#16161A";
        miniApp.setHeaderColor("#16161A");

        return () => {
            document.body.style.backgroundColor = previousBackgroundColor;
            miniApp.setHeaderColor("#1f1f25");
        };
    }, []);

    const [rotation, setRotation] = useState<number>(0);

    const handleReload = () => {
        setRotation(rotation - 360);
        refetchBalance();
    };

    const isDesktop = checkDesktopPlatform();
    const { connect } = useOpenConnect();
    const [scanHandle] = useQRScanner({ connect });

    return (
        <PrivateLayout>
            <div className={s.home}>
                {/* <MainWalletInfo /> */}

                <div className={s.top}>
                    <UserInfo />
                    <div className={s.topActions}>
                        <motion.button
                            className={s.icon_button}
                            animate={{ rotate: rotation }}
                            transition={{ duration: 0.6 }}
                            onClick={handleReload}
                            disabled={accountBalanceFetching}
                        >
                            <SvgSelector id="reload" />
                        </motion.button>

                        <button className={s.icon_button} disabled={isDesktop} onClick={scanHandle}>
                            <SvgSelector id="qr-code-2" />
                        </button>
                    </div>
                </div>

                <div className={s.balance}>
                    <div className={s.balanceLabel}>{t("common.total-balance")}</div>
                    <div className={s.balanceText}>
                        {accountBalanceFetching ? (
                            <SkeletonRect height={40} width={200} />
                        ) : (
                            "$" + formatNumber(String(accountBalance?.totalUSDBalance))
                        )}
                    </div>
                </div>

                <CreateCard />

                <div className={s.actions}>
                    <div className={s.actionsButton} onClick={() => navigate("/send")}>
                        <div className={s.actionsIcon}>
                            <SvgSelector id="arrow-up" />
                        </div>
                        <div className={s.actionsText}>{t("main.send-btn")}</div>
                    </div>
                    <div className={s.actionsButton} onClick={() => navigate("/receive")}>
                        <div className={s.actionsIcon}>
                            <SvgSelector id="arrow-down" />
                        </div>
                        <div className={s.actionsText}>{t("main.receive-btn")}</div>
                    </div>
                </div>

                {/* <AlertMessage
                        btnText="Показать секретную фразу"
                        description="Сохраните секретную фразу, чтобы не потерять доступ к кошельку"
                        onClick={() => {}}
                    /> */}

                <div className={s.homeContent}>
                    {/* <TabSelector
                        disabled={accountBalanceFetching}
                        activeTab={tab}
                        setActiveTab={setActiveTab}
                        tabs={tabs}
                    /> */}
                    <TokensList
                        search
                        isSelectMode
                        includedImportsIcon
                        onTokenSelect={handleTokenSelect}
                        accountBalance={accountBalance || null}
                        isLoading={accountBalanceFetching}
                    />
                    {/* {tab === "main.navigation.history" && <TransactionsHistoryList />}
                    {tab === "main.navigation.nft" && <NftList />} */}
                </div>
            </div>
        </PrivateLayout>
    );
};
