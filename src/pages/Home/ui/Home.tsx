/* eslint-disable no-irregular-whitespace */
import { Address } from "@ton/ton";
import queryString from "query-string";
import { FC, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NftList } from "@/widgets/nft";
import { TokensList } from "@/widgets/token/ui/TokensList/TokensList";
import { TransactionsHistoryList } from "@/widgets/transaction";
import { MainWalletInfo } from "@/widgets/wallet";
import { useHandleConnectMessage } from "@/features/connect";
import { useConnectEffect } from "@/features/connect/lib/useConnectEffect";
import { useFetchTotalBalanceQuery } from "@/entities/multichainAccount";
import { TabSelector } from "@/shared/components";
import { PrivateLayout } from "@/shared/layouts";
import { TokenBalance } from "@/shared/lib/types/multichainAccount";
import { TokenDetailQueryObj } from "@/shared/lib/types/token";
import s from "./Home.module.scss";

export const Home: FC = () => {
    const [tab, setActiveTab] = useState("main.navigation.assets");

    const tabs = ["main.navigation.assets", "main.navigation.nft"];

    const {
        data: accountBalance,
        isFetching: accountBalanceFetching
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
    // test();

    return (
        <PrivateLayout>
            <div className={s.home}>
                <MainWalletInfo />

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
                    {tab === "main.navigation.assets" && (
                        <TokensList
                            search
                            isSelectMode
                            includedImportsIcon
                            onTokenSelect={handleTokenSelect}
                            accountBalance={accountBalance || null}
                            isLoading={accountBalanceFetching}
                        />
                    )}
                    {tab === "main.navigation.history" && <TransactionsHistoryList />}
                    {tab === "main.navigation.nft" && <NftList />}
                </div>
            </div>
        </PrivateLayout>
    );
};
