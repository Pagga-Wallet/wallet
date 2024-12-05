import { skipToken } from "@reduxjs/toolkit/query";
import queryString from "query-string";
import { FC, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TransactionsHistoryListDetail } from "@/widgets/transaction";
import {
    useDeleteImportedTokenMutation,
    useFetchTotalBalanceQuery,
    useGetImportedTokensQuery,
} from "@/entities/multichainAccount";
import { useGetTokenPriceHistoryQuery } from "@/entities/token/model/tokenService";
import { TokenDetailInfo } from "@/entities/token/ui";
import { BigButton } from "@/shared/components";
import { Chart } from "@/shared/components/Chart";
import { SkeletonRect, SkeletonSquare } from "@/shared/components/Skeletons";
import { BaseLayout } from "@/shared/layouts";
import { useSetupBackButton } from "@/shared/lib";
import { CHAINS, TokenBalance } from "@/shared/lib/types";
import { TokenDetailQueryObj } from "@/shared/lib/types/token";
import s from "./TokenDetail.module.scss";

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
                    (token) => token.tokenContract === tokenContract
                );
            else return undefined;
        } else return undefined;
    }, [query, accountBalance]);

    const { data: priceHistory = [], isFetching: priceHistoryFetching } =
        useGetTokenPriceHistoryQuery(tokenBalance ?? skipToken);

    const isImportedToken = Boolean(
        tokenBalance &&
            savedTokens &&
            (savedTokensFetching ||
                savedTokens[tokenBalance.platform].includes(tokenBalance.tokenContract ?? ""))
    );

    const deleteSavedToken = async () => {
        if (tokenBalance && isImportedToken) {
            const res = await deleteImportedToken({
                token: tokenBalance.tokenContract ?? "",
                chain: tokenBalance.platform,
            }).unwrap();
            if (res.success) navigate("/home");
        }
    };

    return (
        <BaseLayout>
            <div className={s.detail}>
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
                    <SkeletonRect borderRadius={32} width="100%" height={298} />
                )}
                {!accountBalanceLoading && tokenBalance ? (
                    <TransactionsHistoryListDetail token={tokenBalance} />
                ) : null}
            </div>
        </BaseLayout>
    );
};
