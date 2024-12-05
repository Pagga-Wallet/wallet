import React from "react";
import { Provider } from "react-redux";
import { store } from "@/shared/lib/redux";

export const withStore = (component: () => React.ReactNode) => () => {
    return <Provider store={store}>{component()}</Provider>;
};
