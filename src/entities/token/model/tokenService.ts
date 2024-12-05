import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { coingeckoClient } from "@/shared/api/coingecko";
import { getEVMAPIClientByChain } from "@/shared/api/evm";
import { TronAPI } from "@/shared/api/tron";
import { registerService } from "@/shared/lib/redux";
import { TokenPriceHistory } from "@/shared/lib/types";
import {
    CHAINS,
    IMultichainAccount,
    TokenBalance,
    isEVMChain,
} from "@/shared/lib/types/multichainAccount";

export const tokensAPI = createApi({
    reducerPath: "tokensApi",
    baseQuery: fakeBaseQuery<{
        message: string;
    }>(),
    tagTypes: ["Tokens"],
    endpoints: (builder) => ({
        getTokenByContract: builder.query<
            TokenBalance | null,
            { tokenContract: string; chain: CHAINS }
        >({
            queryFn: async ({ tokenContract, chain }, { getState }) => {
                const account: IMultichainAccount = (getState() as any).multichainAccount.account;
                if (chain === CHAINS.TRON) {
                    const client = new TronAPI(account.multiwallet.TRON.address);
                    const { data } = await client.getTokenByContractAddress({
                        contractaddress: tokenContract,
                    });
                    return {
                        data,
                    };
                } else if (isEVMChain(chain)) {
                    const client = getEVMAPIClientByChain(account.multiwallet.ETH.address, chain);
                    const { data } = await client.getTokenByContractAddress({
                        contractaddress: tokenContract,
                    });
                    return {
                        data,
                    };
                } else throw new Error("Invalid chain");
            },
        }),
        getTokenPriceHistory: builder.query<TokenPriceHistory, TokenBalance>({
            queryFn: async (token) => {
                const data = await coingeckoClient.getPriceHistoryByToken(token);
                return {
                    data,
                };
            },
        }),
    }),
});

registerService(tokensAPI);
export const { useGetTokenByContractQuery, useGetTokenPriceHistoryQuery } = tokensAPI;
