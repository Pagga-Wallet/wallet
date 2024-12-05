import React from "react";
import { PINCreationProvider } from "@/features/PIN/";

export const withPINCreationProvider = (component: () => React.ReactNode) => () => {
    return <PINCreationProvider>{component()}</PINCreationProvider>;
};
