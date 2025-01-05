import { FC, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TokenListItem, TokenListItemSkeleton } from "@/entities/token/ui";
import { Button, SearchInput } from "@/shared/components";
import { SvgSelector } from "@/shared/lib/assets/svg-selector";
import { sortTokens } from "@/shared/lib/helpers/sortTokens";
import { CHAINS, TokenBalance, TotalBalance } from "@/shared/lib/types";
import s from "./TokensList.module.sass";

interface TokensListSelectable {
    search?: boolean;
    accountBalance: TotalBalance | null;
    onTokenSelect: (token: TokenBalance) => void;
    isSelectMode: true;
    includedImportsIcon?: boolean;
    isLoading?: boolean;
    chainFilter?: CHAINS[];
    tokenList?: TokenBalance[];
    isSend?: boolean;
}

interface TokensList {
    search?: boolean;
    accountBalance: TotalBalance | null | undefined;
    onTokenSelect?: undefined;
    isSelectMode?: false;
    includedImportsIcon?: boolean;
    isLoading?: boolean;
    chainFilter?: CHAINS[];
    tokenList?: TokenBalance[];
    isSend?: boolean;
}

export const TokensList: FC<TokensList | TokensListSelectable> = ({
    search,
    accountBalance,
    onTokenSelect,
    isSelectMode,
    includedImportsIcon,
    isLoading = false,
    chainFilter,
    tokenList,
    isSend
}) => {
    const [searchValue, setSearchValue] = useState<string>("");

    const navigate = useNavigate();

    const sortedTokens: TokenBalance[] = useMemo(() => {
        if (accountBalance) {
            // PROD-TON-ONLY
            // const allTokens = tokenList ?? [
            //     accountBalance.chains.TON.nativeToken,
            //     ...(accountBalance.chains.TON.tokens ?? []),
            // ];
            const allTokens =
                tokenList ??
                Object.values(accountBalance.chains).reduce(
                    (pv, cv) => [...pv, cv.nativeToken, ...(cv.tokens ?? [])],
                    [] as TokenBalance[]
                );
            return sortTokens(allTokens);
        } else return [];
    }, [accountBalance, tokenList]);

    const filteredTokens: TokenBalance[] = useMemo(() => {
        const filtered = sortedTokens.filter(
            (token) =>
                token.tokenSymbol.toLowerCase().includes(searchValue.toLowerCase().trim()) &&
                (chainFilter ? chainFilter.includes(token.platform) : true)
        );
        return filtered;
    }, [searchValue, sortedTokens, chainFilter]);

    return (
        <div className={s.tokensList} style={{
            padding: isSend ? "16px 0 0 0" : "72px 0 0 0"
        }}>
            {search && (
                <div
                    className={s.tokensListTop}
                    style={{ display: includedImportsIcon ? "flex" : "" }}
                >
                    <SearchInput setValue={setSearchValue} value={searchValue} />
                    {includedImportsIcon && (
                        <Button
                            type="grey"
                            className={s.importBtn}
                            onClick={() => navigate("/import/token")}
                            // isDisabled
                        >
                            <SvgSelector id="import" />
                        </Button>
                    )}
                </div>
            )}
            <div className={s.list}>
                {isLoading ? (
                    <TokenListItemSkeleton count={10} />
                ) : (
                    filteredTokens.map((token) => (
                        <TokenListItem
                            key={
                                token.tokenID +
                                token.platform +
                                token.tokenSymbol +
                                token.tokenContract
                            }
                            name={token.tokenSymbol}
                            balance={token.balance}
                            balanceUSD={token.balanceUSD}
                            tokenPrice={token.price}
                            change24={token.change24h}
                            chain={token.isNativeToken ? undefined : token.platform}
                            icon={token.tokenIcon}
                            onClick={isSelectMode ? () => onTokenSelect?.(token) : undefined}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
