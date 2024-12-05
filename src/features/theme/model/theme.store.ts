import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { createBaseSelector, registerSlice } from "@/shared/lib";
import { LS_KEY } from "../consts";

export type Theme = "dark" | "light";

const initialState: { theme: Theme } = {
    theme: (localStorage.getItem(LS_KEY) as Theme) || "dark",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
        },
    },
});

const baseSelector = createBaseSelector(themeSlice);
registerSlice([themeSlice]);

export const themeStore = {
    actions: {
        setTheme: themeSlice.actions.setTheme,
    },
    selectors: {
        selectTheme: createSelector(baseSelector, (state) => state.theme),
    },
};
