import { createSelector, createSlice } from "@reduxjs/toolkit";
import { createBaseSelector, registerSlice } from "@/shared/lib";
import { ConnectReplyBuilder } from "@/shared/lib/connect/ConnectReplyBuilder";
import { DAppManifest, TonConnectModalResponse } from "@/shared/lib/connect/models";

interface ConnectSlice {
    manifest: DAppManifest | null;
    replyBuilder: ConnectReplyBuilder | null;
    requestPromise: {
        resolve: (response: TonConnectModalResponse) => void;
        reject: () => void;
    } | null;
}

const initialState: ConnectSlice = {
    manifest: null,
    replyBuilder: null,
    requestPromise: null,
};

export const connectSlice = createSlice({
    name: "connect",
    initialState,
    reducers: {
        setConnectionParams: (state, action) => {
            state.manifest = action.payload.manifest;
            state.replyBuilder = action.payload.replyBuilder;
            state.requestPromise = action.payload.requestPromise;
        },
    },
});

const baseSelector = createBaseSelector(connectSlice);
registerSlice([connectSlice]);

export const connectStore = {
    actions: {
        setConnectionParams: connectSlice.actions.setConnectionParams,
    },
    selectors: {
        selectReplyBuilder: createSelector(baseSelector, (state) => state.replyBuilder),
        selectManifest: createSelector(baseSelector, (state) => state.manifest),
        selectRequestPromise: createSelector(baseSelector, (state) => state.requestPromise),
    },
};
