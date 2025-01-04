import { skipToken } from "@reduxjs/toolkit/query";
import queryString from "query-string";
import { FC, useEffect, useMemo } from "react";
import { miniApp } from "@telegram-apps/sdk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { TransactionsHistoryListDetail } from "@/widgets/transaction";
import {
    useDeleteImportedTokenMutation,
    useFetchTotalBalanceQuery,
    useGetImportedTokensQuery
} from "@/entities/multichainAccount";
import { useGetTokenPriceHistoryQuery } from "@/entities/token/model/tokenService";
import { TokenDetailInfo } from "@/entities/token/ui";
import { BigButton } from "@/shared/components";
import { Chart } from "@/shared/components/Chart";
import { SkeletonRect } from "@/shared/components/Skeletons";
import { BaseLayout } from "@/shared/layouts";

import { useSetupBackButton } from "@/shared/lib";
import { CHAINS, TokenBalance } from "@/shared/lib/types";

import { TokenDetailQueryObj } from "@/shared/lib/types/token";

import s from "./TokenDetail.module.sass";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";

export const TokenDetail: FC = () => {
    useSetupBackButton();
    const location = useLocation();
    const navigate = useNavigate();
    const query: TokenDetailQueryObj = Object(
        queryString.parse(location.search, { parseBooleans: true })
    );

    const { data: accountBalance, isLoading: accountBalanceLoading } = useFetchTotalBalanceQuery();
    const { data: savedTokens, isFetching: savedTokensFetching } = useGetImportedTokensQuery();
    const [deleteImportedToken] = useDeleteImportedTokenMutation();

    const { t } = useTranslation();

    // Получение баланса выбранного токена из общего списка балансов
    const tokenBalance: TokenBalance | undefined = useMemo(() => {
        // console.log(params.id, accountBalance);
        if (accountBalance && query) {
            const { platform, tokenContract, isNativeToken } = query;
            if (isNativeToken)
                // если токен нативный
                return accountBalance.chains[platform as CHAINS].nativeToken;
            else if (accountBalance.chains[platform as CHAINS].tokens)
                // если токен не нативный, ищем в чейне совпадение по ID
                return accountBalance.chains[platform as CHAINS].tokens?.find(
                    token => token.tokenContract === tokenContract
                );
            else return undefined;
        } else return undefined;
    }, [query, accountBalance]);

    const {
        data: priceHistory = [],
        isFetching: priceHistoryFetching
    } = useGetTokenPriceHistoryQuery(tokenBalance ?? skipToken);

    const isImportedToken = Boolean(
        tokenBalance &&
            savedTokens &&
            (savedTokensFetching ||
                savedTokens[tokenBalance.platform].includes(tokenBalance.tokenContract ?? ""))
    );

    const deleteSavedToken = async () => {
        if (tokenBalance && isImportedToken) {
            const userConfirmed = window.confirm("Are you sure you want to delete this token?");
            if (userConfirmed) {
                const res = await deleteImportedToken({
                    token: tokenBalance.tokenContract ?? "",
                    chain: tokenBalance.platform
                }).unwrap();
                if (res.success) navigate("/home");
            }
        }
    };

    useEffect(() => {
        const previousBackgroundColor = document.body.style.backgroundColor;
        document.body.style.backgroundColor = "#16161A";
        miniApp.setHeaderColor("#16161A");

        return () => {
            document.body.style.backgroundColor = previousBackgroundColor;
            miniApp.setHeaderColor("#1f1f25");
        };
    }, []);

    const onSendClick = () => {
        navigate("/send", {
            state: {
                preselectedToken: tokenBalance
            }
        });
    };

    return (
        <BaseLayout withoutPadding>
            {!accountBalanceLoading && tokenBalance ? (
                <TokenDetailInfo token={tokenBalance} />
            ) : null}
            {!accountBalanceLoading && tokenBalance && isImportedToken ? (
                <BigButton
                    title="Убрать из списка"
                    onClick={deleteSavedToken}
                    style={{ color: "rgb(var(--accent-danger))" }}
                />
            ) : null}

            {!priceHistoryFetching ? (
                <Chart
                    currentPrice={tokenBalance!.price}
                    priceChange={tokenBalance!.change24h!}
                    points={priceHistory}
                />
            ) : (
                <div style={{ marginBottom: 24 }}>
                    <SkeletonRect borderRadius={32} width="100%" height={248} />
                </div>
            )}

            <div className={s.actions}>
                <div className={s.action} onClick={onSendClick}>
                    <button className={s.icon_button}>
                        <SvgSelector id="arrow-up" />
                    </button>
                    <div className={s.actionName}>{t("main.send-btn")}</div>
                </div>
                <div
                    className={s.action}
                    onClick={() => navigate(`/receive?tokenPlatfrom=${tokenBalance?.platform}`)}
                >
                    <button className={s.icon_button}>
                        <SvgSelector id="arrow-down" />
                    </button>
                    <div className={s.actionName}>{t("main.receive-btn")}</div>
                </div>
            </div>
            <div className={s.content}>
                {!accountBalanceLoading && tokenBalance ? (
                    <TransactionsHistoryListDetail token={tokenBalance} />
                ) : null}
            </div>
        </BaseLayout>
    );
};
