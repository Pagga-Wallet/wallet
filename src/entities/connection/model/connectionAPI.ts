import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { telegramStorage } from "@/shared/api/telegramStorage";
import { registerService } from "@/shared/lib/redux";
import { IConnection } from "./types";

const connectionAPI = createApi({
    reducerPath: "connectionAPI",
    baseQuery: fakeBaseQuery<{
        message: string;
    }>(),
    tagTypes: ["Connection"],
    endpoints(builder) {
        return {
            removeConnection: builder.mutation<boolean, string>({
                queryFn: async (clientSessionId) => {
                    const storageConnections = await telegramStorage.getConnections();
                    const connection = storageConnections.find(
                        (connection) => connection.clientSessionId === clientSessionId
                    );
                    const result = await telegramStorage.removeConnection(connection.key);
                    return {
                        data: result,
                    };
                },
                invalidatesTags: (result, error, clientSessionId) =>
                    result ? [{ type: "Connection", id: clientSessionId }] : [],
            }),
            addConnection: builder.mutation({
                queryFn: async (newConnection: IConnection) => {
                    const storageConnections = await telegramStorage.getConnections();
                    const filteredConnections = storageConnections.filter(
                        (connection) =>
                            connection.name !== newConnection.name &&
                            newConnection.accId !== connection.accId
                    );
                    const result = await telegramStorage.saveConnections([
                        ...filteredConnections,
                        newConnection,
                    ]);
                    return {
                        data: result,
                    };
                },
                async onQueryStarted(connection, { queryFulfilled, dispatch }) {
                    const patchResult = dispatch(
                        connectionAPI.util.updateQueryData("getConnections", {}, (connections) => {
                            connections.push(connection);
                        })
                    );
                    try {
                        await queryFulfilled;
                    } catch {
                        patchResult.undo();
                    }
                },
            }),
            getConnections: builder.query<
                IConnection[],
                {
                    accId?: string;
                }
            >({
                queryFn: async ({ accId }) => {
                    const connections = await telegramStorage.getConnections();

                    return {
                        data: accId
                            ? connections.filter((connection) => connection.accId === accId)
                            : connections,
                    };
                },
                providesTags: (result) =>
                    result
                        ? result.map((item) => ({ type: "Connection", id: item.clientSessionId }))
                        : [],
            }),
        };
    },
});

registerService(connectionAPI);
export const { useGetConnectionsQuery, useRemoveConnectionMutation, useAddConnectionMutation } =
    connectionAPI;
