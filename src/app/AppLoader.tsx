import React from "react";
import {
    useAvailableAccounts,
    useFetchAccountsQuery,
    useFetchTotalBalanceQuery,
    useLoadAccountQuery,
    useLoadTonVersionQuery
} from "@/entities/multichainAccount";
import { Loader } from "@/shared/components";
import { useIsFetchingQuery } from "@/shared/lib/hooks/useIsFetchingQuery";
import { useIsPendingMutation } from "@/shared/lib/hooks/useIsPendingMutation";
interface AppLoaderProps {
    children: React.ReactNode;
}

export const AppLoader = ({ children }: AppLoaderProps) => {
    const { isLoading: loadingTonVersion } = useLoadTonVersionQuery();
    const { loading: loadingLastAccId, lastAccId } = useAvailableAccounts();
    useLoadAccountQuery(lastAccId as string, {
        skip: !lastAccId
    });
    useFetchTotalBalanceQuery(undefined, {
        skip: !lastAccId
    });
    const { isLoading: loadingAccounts, isFetching: fetchingAccounts } = useFetchAccountsQuery(
        undefined,
        {
            skip: !lastAccId
        }
    );
    const isFetchingAccount = useIsFetchingQuery("loadAccount");
    const isDeletingAcc = useIsPendingMutation("deleteAccount");

    const showLoader =
        loadingLastAccId ||
        loadingAccounts ||
        fetchingAccounts ||
        isFetchingAccount ||
        isDeletingAcc ||
        loadingTonVersion;

    if (showLoader) {
        return <Loader />;
    }

    return <>{children}</>;
};
