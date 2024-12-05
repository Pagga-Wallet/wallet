import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getNFTDetailsDTOToNFTDetails, tonAPIClient } from "@/shared/api/tonapi";
import { registerService } from "@/shared/lib/redux";
import { NFTDetails } from "./types";

const nftAPI = createApi({
    reducerPath: "nftAPI",
    baseQuery: fakeBaseQuery<{
        message: string;
    }>(),
    endpoints: (builder) => ({
        fetchNFTDetails: builder.query<
            NFTDetails,
            {
                address: string;
            }
        >({
            queryFn: async ({ address }) => {
                const nftDetailsDTO = await tonAPIClient.getNFTDetails({
                    address,
                });
                const nftDetails = getNFTDetailsDTOToNFTDetails(nftDetailsDTO);
                return {
                    data: nftDetails,
                };
            },
        }),
    }),
});

registerService(nftAPI);

export const { useFetchNFTDetailsQuery } = nftAPI;
