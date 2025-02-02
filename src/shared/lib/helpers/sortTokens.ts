import { tokenNativeSortArr, tokenWhitelistSortArr } from "../consts/token/tokensWhitelist";
import { TokenBalance } from "../types";

export const sortTokens = (tokens: TokenBalance[]) =>
    tokens.sort((a, b) => {
        if (!a && !b) return 0;
        // Сортировка нативных токенов
        if (a.isNativeToken && b.isNativeToken) {
            const aIndex = tokenNativeSortArr.findIndex(v => v === a.platform);
            const bIndex = tokenNativeSortArr.findIndex(v => v === b.platform);
            if (aIndex !== bIndex) return aIndex - bIndex;
        } else if (a.isNativeToken) return -1;
        else if (b.isNativeToken) return 1;
        const aContract = (a.tokenContract ?? "").toLowerCase();
        const bContract = (b.tokenContract ?? "").toLowerCase();
        if (
            tokenWhitelistSortArr.includes(aContract) &&
            tokenWhitelistSortArr.includes(bContract)
        ) {
            const aIndex = tokenWhitelistSortArr.findIndex(v => v === aContract);
            const bIndex = tokenWhitelistSortArr.findIndex(v => v === bContract);
            if (aIndex !== bIndex) return aIndex - bIndex;
        } else if (tokenWhitelistSortArr.includes(aContract)) return -1;
        else if (tokenWhitelistSortArr.includes(bContract)) return 1;
        if (b.balanceUSD || a.balanceUSD) return b.balanceUSD - a.balanceUSD;
        return b.balance - a.balance;
    });
