import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { registerService } from "@/shared/lib/redux";
import { CHAINS, TokenBalance } from "@/shared/lib/types";
import { ExecuteSwapParams, SwapBasic, SwapConfigurationDTO, SwapInfo } from "./swapBasic";

export interface GetSwapConfigurationParams {
    params: SwapConfigurationDTO;
    chain: CHAINS;
}

export interface ExecuteSwapMutationParams<T extends CHAINS> {
    params: ExecuteSwapParams<T>;
    chain: T;
}

export const basicSwapAPI = createApi({
    reducerPath: "basicSwapAPI",
    baseQuery: fakeBaseQuery<{
        message: string;
    }>(),
    tagTypes: ["Assets"],
    endpoints: (builder) => ({
        getAssetsList: builder.query<TokenBalance[] | null, CHAINS>({
            queryFn: async (chain) => {
                const swapBasic = new SwapBasic(chain);
                const data = await swapBasic.getAssetsList();
                return {
                    data: data.data,
                };
            },
        }),
        getSwapConfiguration: builder.query<SwapInfo | null, GetSwapConfigurationParams>({
            queryFn: async (params) => {
                const swapBasic = new SwapBasic(params.chain);
                const data = await swapBasic.getSwapConfiguration(params.params);
                return {
                    data: data.data,
                };
            },
        }),
        executeSwap: builder.mutation<boolean, ExecuteSwapMutationParams<CHAINS>>({
            queryFn: async (params) => {
                const swapBasic = new SwapBasic(params.chain);
                const data = await swapBasic.executeSwap(params.params);
                return {
                    data: data.data ?? false,
                };
            },
        }),
    }),
});

registerService(basicSwapAPI);
export const {
    useExecuteSwapMutation,
    useGetAssetsListQuery,
    useGetSwapConfigurationQuery,
    useLazyGetAssetsListQuery,
    useLazyGetSwapConfigurationQuery,
} = basicSwapAPI;
