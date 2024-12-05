import { CHAINS, TokenBalance, TotalBalance } from "@/shared/lib/types";

interface UseBalanceCheckParams {
    gas?: number;
    balance: TotalBalance | null;
    tokenFrom: TokenBalance | null;
    fromAmount: number;
    chain: CHAINS | null;
}

export const useBalanceCheck = ({
    gas,
    balance,
    tokenFrom,
    fromAmount,
    chain,
}: UseBalanceCheckParams) => {
    const isEnoughBalance = (tokenFrom?.balance ?? 0) >= fromAmount;
    const isNativeSelected = tokenFrom?.isNativeToken && tokenFrom.platform === CHAINS.TON;

    const isSufficientNativeForCommission = !chain
        ? false
        : (balance?.chains[chain].nativeToken.balance ?? 0) >=
          (gas ?? 0) + (isNativeSelected ? fromAmount : 0);

    return { isEnoughBalance, isSufficientNativeForCommission };
};
