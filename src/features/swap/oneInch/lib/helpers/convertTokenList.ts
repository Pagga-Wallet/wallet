import { CHAINS, TokenBalance } from "@/shared/lib/types";
import { Tokens } from "../types/tokenList";

export const convertTokenList = (tokens: Tokens, chain: CHAINS): TokenBalance[] =>
    Object.entries(tokens.tokens).map<TokenBalance>(([contract, token]) => ({
        tokenContract: contract,
        tokenID: token.name,
        tokenSymbol: token.symbol,
        tokenName: token.name,
        tokenIcon: token.logoURI ?? "",
        platform: chain,
        decimals: token.decimals,
        isNativeToken: false,
        balance: 0,
        balanceUSD: 0,
        price: 0,
    }));
