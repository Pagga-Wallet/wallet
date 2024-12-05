import React from "react";
import { PINConfirmationProvider } from "@/features/PIN";

export const withConfirmationProvider = (component: () => React.ReactNode) => () => {
    return <PINConfirmationProvider>{component()}</PINConfirmationProvider>;
};
