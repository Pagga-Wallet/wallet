import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { telegramStorage } from "@/shared/api/telegramStorage";
import { registerService } from "@/shared/lib/redux";

export const confirmationAPI = createApi({
    reducerPath: "confirmationApi",
    baseQuery: fakeBaseQuery<{
        message: string;
    }>(),
    tagTypes: ["isUsedBiometry"],
    endpoints: (builder) => ({
        getUseBiometry: builder.query<boolean, void>({
            queryFn: async () => {
                const useBiometry = await telegramStorage.getUseBiometry();
                return {
                    data: useBiometry === "1",
                };
            },
            providesTags: [{ type: "isUsedBiometry" }],
        }),
        setUseBiometry: builder.mutation({
            queryFn: async (value: boolean) => {
                const success = await telegramStorage.setUseBiometry(value ? "1" : "0");
                return {
                    data: {
                        success,
                    },
                };
            },
            invalidatesTags: (result) => (result?.success ? [{ type: "isUsedBiometry" }] : []),
        }),
    }),
});

registerService(confirmationAPI);
export const { useSetUseBiometryMutation, useGetUseBiometryQuery } = confirmationAPI;
