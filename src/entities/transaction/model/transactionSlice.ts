import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createBaseSelector, registerSlice } from "@/shared/lib";
import { BaseTxnParsed } from "@/shared/lib/types/transaction";

interface ITransactionSlice {
    details: BaseTxnParsed | null;
}

const initialState: ITransactionSlice = {
    details: null,
};

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {
        setDetails: (state, action: PayloadAction<BaseTxnParsed>) => {
            state.details = action.payload;
        },
        reset: () => initialState,
    },
});

const baseSelector = createBaseSelector(transactionSlice);
registerSlice([transactionSlice]);

export const transactionStore = {
    actions: transactionSlice.actions,
    selectors: {
        selectDetails: createSelector(baseSelector, (state) => state.details as BaseTxnParsed),
    },
};
