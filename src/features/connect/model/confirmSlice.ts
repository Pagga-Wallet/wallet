import { createSelector, createSlice } from "@reduxjs/toolkit";
import { AppRequest } from "@tonconnect/protocol";
import { IConnection } from "@/entities/connection/model/types";
import { createBaseSelector, registerSlice } from "@/shared/lib";
import { SignRawMessage } from "@/shared/lib/connect/models";
import { SendTransactionError } from "@/shared/lib/connect/SendTransactionError";

type RequestPromise = {
    resolve: () => void;
    reject: (error: SendTransactionError) => void;
};

interface ConnectConfirmSlice {
    connection: IConnection | null;
    messages: SignRawMessage[] | null;
    requestPromise: RequestPromise | null;
    request: AppRequest<"sendTransaction"> | null;
    validUntil: number | null;
}

const initialState: ConnectConfirmSlice = {
    requestPromise: null,
    connection: null,
    messages: null,
    request: null,
    validUntil: null,
};

export const connectConfirmSlice = createSlice({
    name: "connectConfirm",
    initialState,
    reducers: {
        setConfirmConnectParams: (state, action) => {
            state.requestPromise = action.payload.requestPromise;
            state.connection = action.payload.connection;
            state.messages = action.payload.messages;
            state.request = action.payload.request;
            state.validUntil = action.payload.validUntil;
        },
    },
});

const baseSelector = createBaseSelector(connectConfirmSlice);
registerSlice([connectConfirmSlice]);

export const connectConfirmStore = {
    actions: {
        setConfirmConnectParams: connectConfirmSlice.actions.setConfirmConnectParams,
    },
    selectors: {
        selectRequestPromise: createSelector(
            baseSelector,
            (state) => state.requestPromise as RequestPromise
        ),
        selectConnection: createSelector(baseSelector, (state) => state.connection as IConnection),
        selectMessages: createSelector(baseSelector, (state) => state.messages as SignRawMessage[]),
        selectRequest: createSelector(
            baseSelector,
            (state) => state.request as AppRequest<"sendTransaction">
        ),
        selectValidUntil: createSelector(baseSelector, (state) => state.validUntil as number),
    },
};
