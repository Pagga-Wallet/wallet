import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { multichainAccountAPI } from "@/entities/multichainAccount/model/MultichainAccountService";
import { createBaseSelector, registerSlice } from "@/shared/lib";
import { IMultichainAccount, TON_ADDRESS_INTERFACES } from "@/shared/lib/types/multichainAccount";

interface MultichainAccountState {
    account: IMultichainAccount | null;
    tonVersion: TON_ADDRESS_INTERFACES;
}

const initialState: MultichainAccountState = {
    account: null,
    tonVersion: TON_ADDRESS_INTERFACES.V4,
};

const multichainAccountSlice = createSlice({
    name: "multichainAccount",
    initialState,
    reducers: {
        resetAccount: () => {
            return initialState;
        },
        updateAccount: (state, action) => {
            state.account = { ...state.account, ...action.payload };
        },
        setTonVersion: (state, action) => {
            state.tonVersion = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            multichainAccountAPI.endpoints.loadAccount.matchFulfilled,
            (state, action) => {
                state.account = action.payload;
            }
        );
        builder.addMatcher(
            multichainAccountAPI.endpoints.loadTonVersion.matchFulfilled,
            (state, action) => {
                state.tonVersion = action.payload;
            }
        );
    },
});

const baseSelector = createBaseSelector(multichainAccountSlice);
registerSlice([multichainAccountSlice]);

export const multichainAccountStore = {
    actions: {
        resetAccount: multichainAccountSlice.actions.resetAccount,
        updateAccount: multichainAccountSlice.actions.updateAccount,
        setTonVersion: multichainAccountSlice.actions.setTonVersion,
    },
    selectors: {
        selectAccount: createSelector(baseSelector, (state) => state.account),
        selectTonVersion: createSelector(baseSelector, (state) => state.tonVersion),
    },
};
